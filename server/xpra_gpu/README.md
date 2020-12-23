### Build docker image
````
$ sudo docker build -t xpra_gpu .
````

### Initiate xpra
````
$ x11docker --xdummy --gpu --dbus -- "-p 15500:15500" xpra_gpu start firefox-esr
````