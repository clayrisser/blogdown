############################################################
# Image: thingdown/blogdown
# Base: alpine:3.5
############################################################

FROM alpine:3.5

MAINTAINER Jam Risser (jamrizzi)

EXPOSE 8801

ENV ROOT_URI=http://example.com

WORKDIR /app/

RUN apk add --no-cache \
        dnsmasq \
        nginx \
        supervisor \
        tini && \
    apk add --no-cache --virtual build-deps \
        autoconf \
        automake \
        build-base \
        curl \
        gettext-dev \
        git \
        nasm \
        nodejs-current \
        optipng && \
    npm install -g bower && \
    mkdir -p /run/nginx && \
    curl -L -o /sbin/envstamp https://github.com/jamrizzi/envstamp/releases/download/v0.1.0/envstamp && \
    chmod +x /sbin/envstamp

COPY ./package.json /app
COPY ./package-lock.json /app
RUN npm install
COPY ./.bowerrc /app
COPY ./bower.json /app
RUN bower install
COPY ./ /app
RUN ln -sf /usr/bin/optipng /app/node_modules/optipng-bin/vendor/optipng && \
    mkdir /etc/supervisord && \
    mkdir /scripts && \
    mv /app/deployment/nginx.conf /etc/nginx/conf.d/default.conf && \
    mv /app/deployment/supervisord.conf /etc/supervisord/supervisord.conf && \
    mv /app/deployment/nginx.sh /scripts/nginx.sh && \
    cp -r /app/deployment/app/* /app/app && \
    npm run dist && \
    mv /app/dist /dist && \
    rm -rf /app && \
    mv /dist /app && \
    chown -R nobody:nobody /app && \
    apk del build-deps

ENTRYPOINT ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisord/supervisord.conf"]
