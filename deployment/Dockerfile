############################################################
# Dockerfile to run BlogDown
# Based on Ubuntu
############################################################

FROM nginx:latest

MAINTAINER Jam Risser (jamrizzi)

EXPOSE 5000

ENV NGINX_PORT=5000

WORKDIR /app/

RUN apt-get update && \
    apt-get install -y curl git && \
    curl -sL https://deb.nodesource.com/setup_7.x | bash - && \
    apt-get install -y nodejs \
    build-essential && \
    npm install -g bower gulp

COPY ./deployment/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./package.json /app/.tmp/package.json
COPY ./bower.json /app/.tmp/bower.json
COPY ./.bowerrc /app/.tmp/.bowerrc
RUN cd /app/.tmp/ && npm install && bower install
COPY ./ /app/.tmp/
RUN cd /app/.tmp/ && gulp && \
    mv /app/.tmp/dist/* /app/ && rm -rf /app/.tmp/ && \
    chmod -R 755 /app/
