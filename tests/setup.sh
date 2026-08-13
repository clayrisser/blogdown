#!/bin/sh
set -e
. "$(dirname -- "$0")/helper.sh"

dc up -d --build --wait --wait-timeout 300 blogdown
