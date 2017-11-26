#!/bin/sh

/sbin/envstamp /etc/nginx/conf.d/default.conf
/sbin/envstamp /app/content/settings.json
/sbin/envstamp /app/index.html
/usr/sbin/nginx
/usr/bin/tail -f /var/log/nginx/error.log
