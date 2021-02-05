# web-3d
3D Visualizations in Web Based Environment


## TODO:
* ~~Keep checking [sendrecv](https://github.com/centricular/gstwebrtc-demos/tree/master/sendrecv) in order to understand how signalling works (DONE)~~
* ~~Check webrtc web app and try to change it in order to work (DONE)~~
* ~~Fix encoder for CUDA link (DONE, Cuda wasnt installed)~~
* ~~Test different pipelines without cuda (DONE)~~
* ~~Add nvh265 and add 265 and 264 without nvenc (For testing purposes) (DONE)~~
* ~~Fix signalling between devices (Done, added windows.location.hostname)~~
* Fix video stream not working on Windows (even on local network) might need a TURN server? (It's working on Ubuntu and Android)
* Fix x265enc
* Fix vp9enc (Stream starts but no video)
* Fix input:
  * input isn't limited to the selected window
  * add input for mobile devices gestures (three.js already supports this)
* Improve UI in mobile devices
* Add option to change app window size
* Add option to import


## Problems:
* Cuda Coverter not working (Not an implementation problem, but for some reason i'm not able to make gstreamer work with cuda properly, GPU limitation?)
* vp9enc not working, no video (Again this might be a driver or hardware limitation)