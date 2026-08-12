# Shared helpers for the bats smoke suite. POSIX sh.
PROJECT_ROOT="${PROJECT_ROOT:-$(cd "${BATS_TEST_DIRNAME:-${BATS_SUITE_DIRNAME:-$(dirname -- "$0")}}/.." && pwd)}"
COMPOSE_FILE="$PROJECT_ROOT/docker/compose.yaml"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-blogdown-test}"
export COMPOSE_PROJECT_NAME

# The test stack binds 8802 by default so it can coexist with a
# `make serve` dev server on 8801.
BLOGDOWN_PORT="${BLOGDOWN_PORT:-8802}"
export BLOGDOWN_PORT
BLOGDOWN_URL="${BLOGDOWN_URL:-http://localhost:$BLOGDOWN_PORT}"

dc() {
  docker compose -f "$COMPOSE_FILE" --project-name "$COMPOSE_PROJECT_NAME" "$@"
}

# Print the path of a usable Chrome/Chromium binary, or return 1.
find_chrome() {
  for c in google-chrome google-chrome-stable chromium chromium-browser; do
    command -v "$c" 2>/dev/null && return 0
  done
  for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium"; do
    if [ -x "$c" ]; then
      printf '%s\n' "$c"
      return 0
    fi
  done
  return 1
}

# chrome_dump_dom <chrome> <url> [timeout-seconds]
# Print the serialized DOM of <url> after JS ran (virtual time budget).
# Chrome is killed after the timeout: some builds leave updater/crash
# handler children running long after --dump-dom already finished.
chrome_dump_dom() {
  _dd_out=$(mktemp)
  _dd_profile=$(mktemp -d)
  "$1" --headless --disable-gpu --no-sandbox --no-first-run \
    --disable-background-networking --disable-component-update \
    --user-data-dir="$_dd_profile" \
    --virtual-time-budget=20000 --dump-dom "$2" >"$_dd_out" 2>/dev/null &
  _dd_pid=$!
  _dd_i=0
  while kill -0 "$_dd_pid" 2>/dev/null && [ "$_dd_i" -lt "${3:-60}" ]; do
    sleep 1
    _dd_i=$((_dd_i + 1))
  done
  kill "$_dd_pid" 2>/dev/null
  wait "$_dd_pid" 2>/dev/null
  cat "$_dd_out"
  rm -rf "$_dd_out" "$_dd_profile"
}
