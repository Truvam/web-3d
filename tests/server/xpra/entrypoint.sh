#!/bin/bash

while true; do
    xpra start ${DISPLAY} \
        --start-child xfce4-terminal \
        --exit-with-children \
        --bind-tcp=0.0.0.0:8082 \
        --html=on \
        --daemon=no \
        --no-pulseaudio \
        --video-encoders=nvenc 
    sleep 1
done
