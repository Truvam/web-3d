# Dockerfile for HTML5 with xpra in image including sound and GPU acceleration
# Based on: https://github.com/mviereck/x11docker/issues/22#issuecomment-368636240
#
# Example single application:
#   Without arguments midori internet browser will be started:
#     x11docker --xdummy --gpu --dbus-daemon -- "-p 15500:15500" IMAGENAME
#   With start COMMAND a custom command can be specified, here vlc:
#     x11docker --xdummy --gpu --dbus-daemon -- "-p 15500:15500" IMAGENAME start vlc
# openbox desktop:
#     x11docker --xdummy --gpu --dbus-daemon -- "-p 15500:15500" IMAGENAME startx
#
# Access in browser at adress:  http://localhost:15500/

FROM debian:buster

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get  update

# Install locales and set to english
ENV LANG en_US.UTF-8
RUN echo $LANG UTF-8 > /etc/locale.gen
RUN apt-get install -y locales && update-locale --reset LANG=$LANG

# add xpra repository
RUN apt-get install -y apt-transport-https wget curl gnupg
RUN echo "deb https://xpra.org/ buster main" >> /etc/apt/sources.list
RUN curl https://xpra.org/gpg.asc | apt-key add -
RUN apt-get update

# install dbus, xpra, OpenGL and pulseaudio
RUN apt-get install -y dbus-x11 mesa-utils mesa-utils-extra \
    pavucontrol pulseaudio xpra websockify

# desktop
RUN apt-get install -y openbox openbox-menu
RUN sed -i 's%<menu id="/Debian" />%<menu id="pipe-openbox-menu" label="Programme" execute="openbox-menu lxde-applications.menu" />%g' /etc/xdg/openbox/menu.xml

# codecs
RUN apt-get install -y libxvidcore4 gstreamer1.0-plugins-base gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-ugly gstreamer1.0-plugins-bad gstreamer1.0-alsa \
    gstreamer1.0-libav 

# additional applications
RUN apt-get install -y vlc lxterminal
RUN apt-get install -y dillo midori chromium firefox-esr

# default: run desktop
RUN echo '#! /bin/bash \n\
xpra start-desktop $DISPLAY --use-display \
    --html=on --bind-tcp=$(hostname):15500 \
    --start-via-proxy=no --speaker=on --daemon=no \
    --start-child "openbox --sm-disable" --exit-with-children \n\
' > /usr/bin/startx
RUN chmod +x /usr/bin/startx

# start script for single applications
# default without start argument: firefox-esr 
#--min-quality=70  --speed=100
RUN echo '#! /bin/bash \n\
CHILD="$*" \n\
[ -z "$CHILD" ] && CHILD="firefox-esr --kiosk http://192.168.1.80:8080" \n\
xpra start $DISPLAY --use-display \
    --html=on --bind-tcp=$(hostname):15500 \
    --start-via-proxy=no --daemon=no \
    --encoding=h264 --min-quality=99 --speed=99 \ 
    --opengl=yes --video-encoders=x264,vpx \
    --start-child "$CHILD" --exit-with-children \n\
' > /usr/bin/start
RUN chmod +x /usr/bin/start

# start script for xpra default settings

RUN echo '#! /bin/bash \n\
CHILD="$*" \n\
[ -z "$CHILD" ] && CHILD="firefox-esr --kiosk http://192.168.1.80:8080" \n\
xpra start $DISPLAY --use-display \
    --html=on --bind-tcp=$(hostname):15500 \
    --start-via-proxy=no --daemon=no \
    --speed=100 \
    --start-child "$CHILD" --exit-with-children \n\
' > /usr/bin/default
RUN chmod +x /usr/bin/default

CMD start
