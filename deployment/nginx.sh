#!/bin/sh

/sbin/envstamp /etc/nginx/conf.d/default.conf
/usr/sbin/nginx
/usr/bin/tail -f /var/log/nginx/error.log
