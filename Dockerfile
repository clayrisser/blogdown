############################################################
# Dockerfile for thingdown/blogdown
# Based on Alpine
############################################################

FROM alpine:3.5

MAINTAINER Jam Risser (jamrizzi)

EXPOSE 8081

ENV PRERENDER_SERVICE_URL=http://prerender:3000

WORKDIR /app/

RUN apk add --no-cache \
        nginx \
        dnsmasq \
        supervisor \
        tini && \
    apk add --no-cache --virtual build-deps \
        autoconf \
        build-base \
        automake \
        gettext-dev \
        git \
        nasm \
        nodejs-current \
        optipng
RUN npm install -g bower && \
    mkdir -p /run/nginx

COPY ./package.json /app
COPY ./package-lock.json /app
RUN npm install
COPY ./.bowerrc /app
COPY ./bower.json /app
RUN bower install
COPY ./deployment/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./ /app
RUN ln -sf /usr/bin/optipng /app/node_modules/optipng-bin/vendor/optipng && \
    mkdir /etc/supervisord && \
    mv /app/deployment/supervisord.conf /etc/supervisord/supervisord.conf && \
    cp -r /app/deployment/app/* /app/app && \
    npm run dist && \
    mv /app/dist /dist && \
    rm -rf /app && \
    mv /dist /app && \
    chown -R nobody:nobody /app && \
    apk del build-deps

ENTRYPOINT ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisord/supervisord.conf"]
