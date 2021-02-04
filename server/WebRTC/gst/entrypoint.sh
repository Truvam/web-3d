#!/bin/bash

FRAMERATE=30
AUDIO=false
CLIPBOARD=false

while true; do
    python3 /opt/app/main.py --debug \
        --app_name $APP_NAME \
        --framerate $FRAMERATE \
        --enable_audio $AUDIO \
        --enable_clipboard $CLIPBOARD \
        --encoder $ENCODER
    sleep 1
done
