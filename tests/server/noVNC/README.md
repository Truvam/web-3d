### Build docker image
```
$ sudo docker build -t novnc .
```

### Initiate novnc
```
docker run -it --rm -p 8080:8080 novnc
```

### Initiate vnc server
```
x11vnc -id pick
```
Pick window you want to display.