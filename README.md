# web-3d
3D Visualizations in Web Based Environment


## TODO:
### General:
* Fix not working on firefox?
* Fix video stream not working on Windows (even on local network) might need a TURN server? (It's working on Ubuntu and Android)
  * Connection seems to fail.

### GST Pipeline Encoders:
* ~~Keep checking [sendrecv](https://github.com/centricular/gstwebrtc-demos/tree/master/sendrecv) in order to understand how signalling works (DONE)~~
* ~~Check webrtc web app and try to change it in order to work (DONE)~~
* ~~Fix encoder for CUDA link (DONE, Cuda wasnt installed)~~
* ~~Test different pipelines without cuda (DONE)~~
* ~~Add nvh265 and add 265 and 264 without nvenc (For testing purposes) (DONE)~~
* ~~Fix signalling between devices (Done, added windows.location.hostname)~~
* Fix x265enc
* Fix vp9enc (Stream starts but no video)

### Input:
* Fix input:
  * ~~input isn't limited to the selected window (DONE, fixed by utilizing setActiveWindow and Pointer Lock)~~
  * add input for mobile devices gestures (three.js already supports this)

### WebViewer:
* Add WASD Controls.
* Switch between controls based on device type.

### Client
* Improve UI in mobile devices
* Add option to change app window size (Almost done, might need to restart stream each time we change):
  * ~~Possible solutions: (DONE)~~
    * ~~Add resolution option to painel (Dynamic, 1920x1080, etc). (DONE)~~
    * ~~Restart GST Pipeline. (DONE, reload page when window size changes)~~
  * Fix fullscreen when on dynamic (Do not let resolution change when on fullscreen?).
* Add option to switch between encoders.
* Add option to import fbx
  * Will need to upload asset file to server
  * Research on how to make this as secure as possible?

## Unsolved Problems:
* Cuda Coverter not working (Not an implementation problem, but for some reason i'm not able to make gstreamer work with cuda properly, GPU limitation?)
* vp9enc not working, no video (Again this might be a driver or hardware limitation)
* x265 and nvh265enc also did not work.