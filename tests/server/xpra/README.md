### Build docker image
````
$ sudo docker build -t xpra .
````

### Initiate xpra
````
docker run --gpus all --rm -it -p 8082:8082 xpra
````