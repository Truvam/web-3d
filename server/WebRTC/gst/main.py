#!/usr/bin/env python3

import argparse
import asyncio
import http.client
import json
import logging
import os
import socket
import sys
import time
import urllib.parse

from webrtc_input import WebRTCInput
from webrtc_signalling import WebRTCSignalling, WebRTCSignallingErrorNoPeer
from gstwebrtc_app import GSTWebRTCApp
from gpu_monitor import GPUMonitor
from metrics import Metrics


def initiateArgs():
    parser = argparse.ArgumentParser()
    parser.add_argument('--server',
                        default=os.environ.get(
                            'SIGNALLING_SERVER', 'ws://127.0.0.1:8443'),
                        help='Signalling server to connect to, default: "ws://127.0.0.1:8443"')
    parser.add_argument('--stun_server',
                        default=os.environ.get(
                            'STUN_SERVER', 'stun.l.google.com:19302'),
                        help='STUN server to connect to, default: "stun.l.google.com:19302"')
    parser.add_argument('--uinput_mouse_socket',
                        default=os.environ.get('UINPUT_MOUSE_SOCKET', ''),
                        help='path to uinput mouse socket provided by uinput-device-plugin, if not provided, uinput is used directly.')
    parser.add_argument('--uinput_js_socket',
                        default=os.environ.get('UINPUT_JS_SOCKET', ''),
                        help='path to uinput joystick socket provided by uinput-device-plugin, if not provided, uinput is used directly.')
    parser.add_argument('--enable_audio',
                        default=os.environ.get('ENABLE_AUDIO', 'true'),
                        help='enable or disable audio stream')
    parser.add_argument('--enable_clipboard',
                        default=os.environ.get('ENABLE_CLIPBOARD', 'true'),
                        help='enable or disable the clipboard features, supported values: true, false, in, out')
    parser.add_argument('--framerate',
                        default=os.environ.get('WEBRTC_FRAMERATE', '30'),
                        help='framerate of streaming pipeline')
    parser.add_argument('--encoder',
                        default=os.environ.get('WEBRTC_ENCODER', 'nvh264enc'),
                        help='gstreamer encoder plugin to use')
    parser.add_argument('--app_name',
                        default=os.environ.get('APP_NAME', 'firefox'),
                        help='name of the application to stream')
    parser.add_argument('--metrics_port',
                        default=os.environ.get('METRICS_PORT', '8000'),
                        help='port to start metrics server on')
    parser.add_argument('--debug', action='store_true',
                        help='Enable debug logging')

    return parser.parse_args()


if __name__ == '__main__':
    args = initiateArgs()

    logging.warning(args)

    # Set log level
    if args.debug:
        logging.basicConfig(level=logging.DEBUG)
    else:
        logging.basicConfig(level=logging.INFO)

    # Peer id for this app, default is 0, expecting remote peer id to be 1
    my_id = 0
    peer_id = 1

    # Initialize metrics server.
    metrics = Metrics(int(args.metrics_port))

    # Signaling server

    # Initialize the signalling instance
    signalling = WebRTCSignalling(args.server, my_id, peer_id)

    # Handle errors from the signalling server.
    async def on_signalling_error(e):
        if isinstance(e, WebRTCSignallingErrorNoPeer):
            # Waiting for peer to connect, retry in 2 seconds.
            time.sleep(2)
            await signalling.setup_call()
        else:
            logging.error("signalling eror: %s", str(e))
    signalling.on_error = on_signalling_error

    # After connecting, attempt to setup call to peer.
    signalling.on_connect = signalling.setup_call

    # [START main_setup]

    # Create instance of app
    app = GSTWebRTCApp(args.stun_server, None, args.enable_audio ==
                       "true", int(args.framerate), args.encoder, args.app_name)

    # [END main_setup]

    # Send the local sdp to signalling when offer is generated.
    app.on_sdp = signalling.send_sdp

    # Send ICE candidates to the signalling server.
    app.on_ice = signalling.send_ice

    # Set the remote SDP when received from signalling server.
    signalling.on_sdp = app.set_sdp

    # Set ICE candidates received from signalling server.
    signalling.on_ice = app.set_ice

    # Start the pipeline once the session is established.
    signalling.on_session = app.start_pipeline

    # Initialize the Xinput instance
    webrtc_input = WebRTCInput(
        args.uinput_mouse_socket, args.uinput_js_socket, args.enable_clipboard.lower())

    # Log message when data channel is open
    def data_channel_ready():
        logging.info(
            "opened peer data channel for user input to X11")

        app.send_framerate(app.framerate)
        app.send_audio_enabled(app.audio)

    app.on_data_open = lambda: data_channel_ready()

    # Send incomming messages from data channel to input handler
    app.on_data_message = webrtc_input.on_message

    # Send video bitrate messages to app
    webrtc_input.on_video_encoder_bit_rate = lambda bitrate: app.set_video_bitrate(
        int(bitrate))

    # Send audio bitrate messages to app
    webrtc_input.on_audio_encoder_bit_rate = lambda bitrate: app.set_audio_bitrate(
        int(bitrate))

    # Send pointer visibility setting to app
    webrtc_input.on_mouse_pointer_visible = lambda visible: app.set_pointer_visible(
        visible)

    # Send clipboard contents when requested
    webrtc_input.on_clipboard_read = lambda data: app.send_clipboard_data(data)

    # Send client FPS to metrics
    webrtc_input.on_client_fps = lambda fps: metrics.set_fps(fps)

    # Send client latency to metrics
    webrtc_input.on_client_latency = lambda latency_ms: metrics.set_latency(
        latency_ms)

    # Initialize GPU monitor
    gpu_mon = GPUMonitor(enabled=args.encoder.startswith("nv"))

    # Send the GPU stats when available.
    def on_gpu_stats(load, memory_total, memory_used):
        app.send_gpu_stats(load, memory_total, memory_used)
        metrics.set_gpu_utilization(load * 100)

    gpu_mon.on_stats = on_gpu_stats

    # [START main_start]
    # Connect to the signalling server and process messages.
    loop = asyncio.get_event_loop()
    try:
        metrics.start()
        loop.run_until_complete(webrtc_input.connect())
        loop.run_in_executor(None, lambda: webrtc_input.start_clipboard())
        loop.run_in_executor(None, lambda: gpu_mon.start())
        loop.run_until_complete(signalling.connect())
        loop.run_until_complete(signalling.start())
    except Exception as e:
        logging.exception("Caught exception: %s" % e)
        sys.exit(1)
    finally:
        webrtc_input.stop_clipboard()
        webrtc_input.disconnect()
        gpu_mon.stop()
        sys.exit(0)
    # [END main_start]
