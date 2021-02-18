#!/bin/bash

while true; do
    /opt/noVNC/utils/launch.sh --vnc localhost:5900 --listen 8080
    sleep 1
done
