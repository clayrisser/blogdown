#!/bin/sh

/bin/sed -i "s/\${PRERENDER_PORT_8803_TCP_ADDR}/$PRERENDER_PORT_8803_TCP_ADDR/g" \
  /etc/nginx/conf.d/default.conf
/bin/sed -i "s/\${ROOT_URI}/$ROOT_URI/g" \
         /etc/nginx/conf.d/default.conf
/usr/sbin/nginx -g "daemon off;"
