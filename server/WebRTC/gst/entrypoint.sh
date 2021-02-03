#!/bin/bash

APP_NAME=firefox
FRAMERATE=30
AUDIO=false
CLIPBOARD=false

python3 /opt/app/main.py --debug \
    --app_name $APP_NAME \
    --framerate $FRAMERATE \
    --enable_audio $AUDIO \
    --enable_clipboard $CLIPBOARD \
    --encoder $ENCODER
