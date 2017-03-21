############################################################
# Dockerfile to run BlogDown
# Based on Alpine
############################################################

FROM alpine:3.5

MAINTAINER Jam Risser (jamrizzi)

EXPOSE 5000

WORKDIR /app/

RUN apk add --no-cache tini && \
    apk add --no-cache --virtual build-dependencies build-base \
    autoconf \
    automake \
    gettext-dev \
    git \
    nasm \
    nodejs-current \
    optipng
RUN npm install -g yarn && \
    yarn global add bower \
    gulp

COPY ./.bowerrc /app/.tmp/.bowerrc
COPY ./bower.json /app/.tmp/bower.json
COPY ./package.json /app/.tmp/package.json
RUN cd /app/.tmp/ && yarn install && bower install
COPY ./deployment/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./ /app/.tmp/
RUN ln -sf /usr/bin/optipng /app/.tmp/node_modules/optipng-bin/vendor/optipng && \
    cd /app/.tmp/ && gulp && \
    mv /app/.tmp/dist/* /app/ && rm -rf /app/.tmp/ && \
    chown -R nobody:nobody /app/ && \
    apk del build-dependencies

ENTRYPOINT ["/sbin/tini", "--", "/usr/sbin/nginx", "-g", "daemon off;"]
