#!/bin/sh
. "$(dirname -- "$0")/helper.sh"

if [ -n "$KEEP_STACK" ]; then
  echo "KEEP_STACK set; leaving the stack up on port $BLOGDOWN_PORT" >&2
  exit 0
fi
dc down --volumes --remove-orphans
