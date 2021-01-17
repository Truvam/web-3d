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

