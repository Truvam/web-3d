# GStreamer Pipeline

## Usage:
```
./main.py --app_name firefox --debug
```

## Arguments:
```
optional arguments:
  -h, --help            show this help message and exit
  --server SERVER       Signalling server to connect to, default: "ws://127.0.0.1:8443"
  --uinput_mouse_socket UINPUT_MOUSE_SOCKET
                        path to uinput mouse socket provided by uinput-device-plugin, if not provided, uinput is used directly.
  --uinput_js_socket UINPUT_JS_SOCKET
                        path to uinput joystick socket provided by uinput-device-plugin, if not provided, uinput is used directly.
  --enable_audio ENABLE_AUDIO
                        enable or disable audio stream
  --enable_clipboard ENABLE_CLIPBOARD
                        enable or disable the clipboard features, supported values: true, false, in, out
  --framerate FRAMERATE
                        framerate of streaming pipeline
  --encoder ENCODER     gstreamer encoder plugin to use
  --app_name APP_NAME   name of the application to stream
  --metrics_port METRICS_PORT
                        port to start metrics server on
  --debug               Enable debug logging
```

## Supported encoders:
* nvh264enc
* nvh264enc_cuda
* vp8enc
* vp9enc

The supported encoders are dependent on the available GPU. More info about the support can be found here:
* https://developer.nvidia.com/video-encode-and-decode-gpu-support-matrix-new