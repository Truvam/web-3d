#!/bin/bash

echo "Starting GStreamer Pipeline."
sudo docker run -it --rm --gpus all --network=host -e ENCODER=nvh264enc -e APP_NAME=WebViewer -e SERVER= server-gst

