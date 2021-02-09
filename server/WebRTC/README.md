# Web Based 3D Visualizations
## Server (Streaming Implementation)

Based on: 
* https://cloud.google.com/solutions/gpu-accelerated-streaming-using-webrtc
* https://github.com/selkies-project/selkies-vdi
* https://github.com/centricular/gstwebrtc-demos/tree/master/signalling

### GStreamer WebRTC Pipeline
Running on docker (recommended):
```
docker build -t server-gst --network=host .
```
```
docker run -it --rm --gpus all --network=host -e ENCODER=nvh264enc -e APP_NAME=WebViewer server-gst
```
Manually:
```
./main.py --app_name WebViewer --debug --framerate 60 --enable_audio false --encoder nvh264enc
```

### Signalling
```
./simple_server.py --disable-ssl
```

### Start Firefox
```
firefox --kiosk http://localhost:8181/
```

### Start Chrome (Chrome has better performance, need to check why)
```
google-chrome --start-fullscreen --app=http://localhost:8181
```

## Detect X Window ID
Gives X Window information of the clicked window:
```
xwininfo
```
Command used to automate the retrieval of window ID, based on application name (Method: "https://github.com/Truvam/web-3d/blob/main/server/WebRTC/gst/gstwebrtc_app.py#L797"):
```
wmctrl -l | grep -i firefox | awk '{print $1}'
```

## Commands to check if gstreamer is detecting NVENC
```
gst-inspect-1.0 nvcodec
```
```
Plugin Details:
  Name                     nvcodec
  Description              GStreamer NVCODEC plugin
  Filename                 /usr/lib/x86_64-linux-gnu/gstreamer-1.0/libgstnvcodec.so
  Version                  1.19.0.1
  License                  LGPL
  Source module            gst-plugins-bad
  Binary package           GStreamer Bad Plug-ins git
  Origin URL               Unknown package origin

  cudaconvert: CUDA Colorspace converter
  cudadownload: CUDA downloader
  cudascale: CUDA Video scaler
  cudaupload: CUDA uploader
  nvh264dec: NVDEC h264 Video Decoder
  nvh264enc: NVENC H.264 Video Encoder
  nvh264sldec: NVDEC H.264 Stateless Decoder
  nvjpegdec: NVDEC jpeg Video Decoder
  nvmpeg2videodec: NVDEC mpeg2video Video Decoder
  nvmpeg4videodec: NVDEC mpeg4video Video Decoder
  nvmpegvideodec: NVDEC mpegvideo Video Decoder

  11 features:
  +-- 11 elements

```
```
ldconfig -p | grep -E 'libcuda|libnvidia|libnvcuvid.so'
```
```
libnvidia-ptxjitcompiler.so.1 (libc6,x86-64) => /usr/lib/x86_64-linux-gnu/libnvidia-ptxjitcompiler.so.1
libnvidia-opticalflow.so.1 (libc6,x86-64) => /usr/lib/x86_64-linux-gnu/libnvidia-opticalflow.so.1
libnvidia-opencl.so.1 (libc6,x86-64) => /usr/lib/x86_64-linux-gnu/libnvidia-opencl.so.1
libnvidia-ml.so.1 (libc6,x86-64) => /usr/lib/x86_64-linux-gnu/libnvidia-ml.so.1
libnvidia-encode.so.1 (libc6,x86-64) => /usr/lib/x86_64-linux-gnu/libnvidia-encode.so.1
libnvidia-compiler.so.460.32.03 (libc6,x86-64) => /usr/lib/x86_64-linux-gnu/libnvidia-compiler.so.460.32.03
libnvidia-cfg.so.1 (libc6,x86-64) => /usr/lib/x86_64-linux-gnu/libnvidia-cfg.so.1
libnvidia-allocator.so.1 (libc6,x86-64) => /usr/lib/x86_64-linux-gnu/libnvidia-allocator.so.1
libnvcuvid.so.1 (libc6,x86-64) => /usr/lib/x86_64-linux-gnu/libnvcuvid.so.1
libcudart.so.11.0 (libc6,x86-64) => /usr/local/cuda/targets/x86_64-linux/lib/libcudart.so.11.0
libcudart.so (libc6,x86-64) => /usr/local/cuda/targets/x86_64-linux/lib/libcudart.so
libcuda.so.1 (libc6,x86-64) => /usr/lib/x86_64-linux-gnu/libcuda.so.1
```

Possible errors and solutions:
* https://gitlab.freedesktop.org/gstreamer/gst-plugins-bad/-/issues/1469
* https://gitlab.freedesktop.org/gstreamer/gst-plugins-bad/-/issues/1069
* https://gitlab.freedesktop.org/gstreamer/gst-plugins-bad/-/issues/1068
* https://gitlab.freedesktop.org/gstreamer/gst-plugins-bad/-/issues/1067

# GStreamer Pipelines
Here we can see some examples pipelines, in order to fully test if all dependencies are installed and to determine possible problems in our python implementation.

### NVENC + CUDA Pipeline:
Pipeline to encode H.264 video streams using NVIDIA's hardware-accelerated NVENC encoder and CUDA:

```
gst-launch-1.0 filesrc location=test.mp4 ! qtdemux ! h264parse ! nvh264dec ! cudascale ! "video/x-raw(memory:CUDAMemory),width=1280,height=720" ! nvh264enc ! h264parse ! mp4mux ! filesink location=out.mp4
```
Other example with CUDA only:
```
GST_DEBUG=cuda*:7 gst-launch-1.0 ximagesrc ! videoscale ! video/x-raw,width=1280,height=720 ! cudaupload ! cudaconvert ! 'video/x-raw(memory:CUDAMemory),format=I420' ! fakesink
```
Other example with NVENC only:
```
gst-launch-1.0 filesrc location=test.mp4 ! qtdemux ! h264parse ! nvh264dec ! videoscale ! "video/x-raw,width=1280,height=720" ! nvh264enc ! h264parse ! mp4mux ! filesink location=out.mp4
```

### Accelerated GStreamer User Guide: 
Supported GPUs:
* https://developer.nvidia.com/video-encode-and-decode-gpu-support-matrix-new

CUDA Installation Guide:
* https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html

Pipeline Guides:
* https://developer.download.nvidia.com/embedded/L4T/r32_Release_v1.0/Docs/Accelerated_GStreamer_User_Guide.pdf
* https://docs.nvidia.com/jetson/l4t/index.html#page/Tegra%20Linux%20Driver%20Package%20Development%20Guide/accelerated_gstreamer.html#

### COTURN
docker run -it --rm --network=host --env TURN_SHARED_SECRET=$(openssl rand -hex 16) coturn-web