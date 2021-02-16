# Dockerfile for HTML5 with xpra in image including sound and GPU acceleration

# Access in browser at adress:  http://localhost:15500/

FROM nvidia/cuda:11.2.0-devel-ubuntu20.04 

ENV DEBIAN_FRONTEND noninteractive

# Install essentials
RUN \
    apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    wget \
    gnupg2 \
    apt-transport-https \
    vim \
    xfce4-terminal

# Install xpra
ADD https://xpra.org/repos/focal/xpra.list /etc/apt/sources.list.d/xpra-beta.list
RUN curl -sfL https://xpra.org/gpg.asc | apt-key add - && \
    apt-get update && apt-get install -y xpra

# Install Chrome
RUN curl -LO https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb
RUN rm google-chrome-stable_current_amd64.deb

ENV NVIDIA_DRIVER_CAPABILITIES=compute,utility,video

# Set the DISPLAY variable.
ENV DISPLAY :1
VOLUME ["/tmp/.X11-unix:/tmp/.X11-unix:rw"]

# Add entrypoint script
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]