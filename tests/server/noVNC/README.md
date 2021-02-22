### Build docker image
```
$ sudo docker build -t novnc .
```

### Initiate novnc
```
docker run -it --rm --network=host novnc
```

### Initiate vnc server
```
x11vnc -id pick -forever
```
Pick window you want to display.