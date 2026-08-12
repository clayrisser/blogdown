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

# cdp_probe <chrome> <url> <expect> [timeout-seconds]
# Load <url> in headless Chrome and poll the DOM over the DevTools
# Protocol until it contains <expect>; prints the serialized DOM.
# Returns non-zero if the content never renders. Fast: exits as soon
# as the SPA has rendered instead of waiting on a chrome process that
# never terminates (--dump-dom hangs on modern Chrome builds).
cdp_probe() {
  node "$PROJECT_ROOT/tests/cdp_probe.js" "$@"
}
