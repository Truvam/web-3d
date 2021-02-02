#!/bin/bash

APP_NAME=firefox
FRAMERATE=30
AUDIO=false

python3 /opt/app/main.py --debug \
    --app_name $APP_NAME \
    --framerate $FRAMERATE \
    --enable_audio $AUDIO \
    --encoder $ENCODER
