/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*eslint no-unused-vars: ["error", { "vars": "local" }]*/


/**
* @typedef {Object} WebRTCDemoSignalling
* @property {function} ondebug - Callback fired when a new debug message is set.
* @property {function} onstatus - Callback fired when a new status message is set.
* @property {function} onerror - Callback fired when an error occurs.
* @property {function} onice - Callback fired when a new ICE candidate is received.
* @property {function} onsdp - Callback fired when SDP is received.
* @property {function} connect - initiate connection to server.
* @property {function} disconnect - close connection to server.
*/
class WebRTCDemoSignalling {
    /**
     * Interface to WebRTC demo signalling server.
     * Protocol: https://github.com/centricular/gstwebrtc-demos/blob/master/signalling/Protocol.md
     *
     * @constructor
     * @param {URL} [server]
     *    The URL object of the signalling server to connect to, created with `new URL()`.
     *    Signalling implementation is here:
     *      https://github.com/centricular/gstwebrtc-demos/tree/master/signalling
     * @param {number} [peer_id]
     *    The peer ID established during signalling that the sending peer (server) will connect to.
     *    This can be anything, but must match what the server will attempt to connect to.
     */
    constructor(server, peer_id) {
        /**
         * @private
         * @type {URL}
         */
        this._server = server;

        /**
         * @private
         * @type {number}
         */
        this._peer_id = peer_id;

        /**
         * @private
         * @type {WebSocket}
         */
        this._ws_conn = null;

        /**
         * @event
         * @type {function}
         */
        this.onstatus = null;

        /**
         * @event
         * @type {function}
         */
        this.onerror = null;

        /**
         * @type {function}
         */
        this.ondebug = null;

        /**
         * @event
         * @type {function}
         */
        this.onice = null;

        /**
         * @event
         * @type {function}
         */
        this.onsdp = null;

        /**
         * @type {string}
         */
        this.state = 'disconnected';
    }

    /**
     * Sets status message.
     *
     * @private
     * @param {String} message
     */
    _setStatus(message) {
        console.log("_setStatus:signalling: " + message);
        if (this.onstatus !== null) {
            this.onstatus(message);
        }
    }

    /**
     * Sets a debug message.
     * @private
     * @param {String} message
     */
    _setDebug(message) {
        console.log("_setDebug:signalling: " + message);
        if (this.ondebug !== null) {
            this.ondebug(message);
        }
    }

    /**
     * Sets error message.
     *
     * @private
     * @param {String} message
     */
    _setError(message) {
        console.log("_setError:signalling: " + message);
        if (this.onerror !== null) {
            this.onerror(message);
        }
    }

    /**
     * Sets SDP
     *
     * @private
     * @param {String} message
     */
    _setSDP(sdp) {
        if (this.onsdp !== null) {
            this.onsdp(sdp);
        }
    }

    /**
     * Sets ICE
     *
     * @private
     * @param {RTCIceCandidate} icecandidate
     */
    _setICE(icecandidate) {
        if (this.onice !== null) {
            this.onice(icecandidate);
        }
    }

    /**
     * Fired whenever the signalling websocket is opened.
     * Sends the peer id to the signalling server.
     *
     * @private
     * @event
     */
    _onServerOpen() {
        this.state = 'connected';
        this._ws_conn.send('HELLO ' + this._peer_id);
        this._setStatus("Registering with server, peer ID: " + this._peer_id);
    }

    /**
     * Fired whenever the signalling websocket emits and error.
     * Reconnects after 3 seconds.
     *
     * @private
     * @event
     */
    _onServerError() {
        this._setStatus("Connection error, retry in 3 seconds.");
        if (this._ws_conn.readyState === this._ws_conn.CLOSED) {
            setTimeout(() => {
                this.connect();
            }, 3000);
        }
    }

    /**
     * Fired whenever a message is received from the signalling server.
     * Message types:
     *   HELLO: response from server indicating peer is registered.
     *   ERROR*: error messages from server.
     *   {"sdp": ...}: JSON SDP message
     *   {"ice": ...}: JSON ICE message
     *
     * @private
     * @event
     * @param {Event} event The event: https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
     */
    _onServerMessage(event) {
        this._setDebug("server message: " + event.data);

        if (event.data === "HELLO") {
            this._setStatus("Registered with server.");
            this._setStatus("Waiting for video stream.");
            return;
        }

        if (event.data.startsWith("ERROR")) {
            this._setStatus("Error from server: " + event.data);
            // TODO: reset the connection.
            return;
        }

        // Attempt to parse JSON SDP or ICE message
        var msg;
        try {
            msg = JSON.parse(event.data);
        } catch (e) {
            if (e instanceof SyntaxError) {
                this._setError("error parsing message as JSON: " + event.data);
            } else {
                this._setError("failed to parse message: " + event.data);
            }
            return;
        }

        if (msg.sdp != null) {
            this._setSDP(new RTCSessionDescription(msg.sdp));
        } else if (msg.ice != null) {
            var icecandidate = new RTCIceCandidate(msg.ice);
            this._setICE(icecandidate);
        } else {
            this._setError("unhandled JSON message: " + msg);
        }
    }

    /**
     * Fired whenever the signalling websocket is closed.
     * Reconnects after 1 second.
     *
     * @private
     * @event
     */
    _onServerClose() {
        if (this.state !== 'connecting') {
            this.state = 'disconnected';
            this._setError("Server closed connection, reconnecting.");
            setTimeout(() => {
                this.connect();
            }, 3000);
        }
    }

    /**
     * Initiates the connection to the signalling server.
     * After this is called, a series of handshakes occurs between the signalling
     * server and the server (peer) to negotiate ICE candiates and media capabilities.
     */
    connect() {
        this.state = 'connecting';
        this._setStatus("Connecting to server.");

        this._ws_conn = new WebSocket(this._server);

        // Bind event handlers.
        this._ws_conn.addEventListener('open', this._onServerOpen.bind(this));
        this._ws_conn.addEventListener('error', this._onServerError.bind(this));
        this._ws_conn.addEventListener('message', this._onServerMessage.bind(this));
        this._ws_conn.addEventListener('close', this._onServerClose.bind(this));
    }

    /**
     * Closes connection to signalling server.
     * Triggers onServerClose event.
     */
    disconnect() {
        this._ws_conn.close();
    }

    /**
     * Send ICE candidate.
     *
     * @param {RTCIceCandidate} ice
     */
    sendICE(ice) {
        this._setDebug("sending ice candidate: " + JSON.stringify(ice));
        this._ws_conn.send(JSON.stringify({ 'ice': ice }));
    }

    /**
     * Send local session description.
     *
     * @param {RTCSessionDescription} sdp
     */
    sendSDP(sdp) {
        this._setDebug("sending local sdp: " + JSON.stringify(sdp));
        this._ws_conn.send(JSON.stringify({ 'sdp': sdp }));
    }

    printDebug() {
        console.log("Server: " + this._server);
        console.log("PeerID: " + this._peer_id);
    }
}