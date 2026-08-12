MAKEFLAGS += --no-print-directory

# Local Make state lives under MAKEDIR. This bower-era repo has no
# committed node_modules, so use .make/ at the repo root (gitignored).
MAKEDIR := $(ROOTDIR)/.make
MARKERS := $(MAKEDIR)/markers

# Recipes spawn fresh non-interactive shells that don't source ~/.zshrc,
# so the asdf shim dir isn't on PATH unless we add it here.
export PATH := $(or $(ASDF_DATA_DIR),$(HOME)/.asdf)/shims:$(PATH)

GIT ?= git
BATS ?= bats
SHFMT ?= shfmt
CLOC ?= cloc

COMPOSE ?= $(eval COMPOSE := $(shell command -v docker-compose >/dev/null 2>&1 && echo docker-compose || echo 'docker compose'))$(COMPOSE)

SUDO ?= $(eval SUDO := $(shell command -v sudo >/dev/null && echo sudo))$(SUDO)
PKG_INSTALL ?= $(eval PKG_INSTALL := $(or \
	$(shell command -v brew >/dev/null && echo 'brew install'), \
	$(shell command -v apt-get >/dev/null && echo '$(SUDO) apt-get update && $(SUDO) apt-get install -y'), \
	$(shell command -v dnf >/dev/null && echo '$(SUDO) dnf install -y'), \
	echo "no supported package manager" >&2;false))$(PKG_INSTALL)

.PHONY: sudo
sudo:
	@$(SUDO) true

.PHONY: FORCE
FORCE:
