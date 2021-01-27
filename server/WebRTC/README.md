# Instructions

## Running x11 on Docker:

Change permissions:
```
xhost +local:docker
```

Run command:
```
docker run -it --rm --gpus all --env="DISPLAY" --volume="/tmp/.X11-unix:/tmp/.X11-unix:rw" glxgears-x11 glxgears
```

## gstwebrtc
```
cd /home/server/Desktop/web-3d/server/WebRTC/remote-desktop/gst

python3 main.py --debug
```

## Signalling
```
cd Desktop/gstwebrtc-demos/signalling/

python3 simple_server.py --disable-ssl
```

## Web APP
```
cd /home/server/Desktop/web-3d/server/WebRTC/remote-desktop/web

python3 -m http.server 8080
```