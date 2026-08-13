.POSIX:
export ROOTDIR ?= $(eval ROOTDIR := $(shell git rev-parse --show-toplevel))$(ROOTDIR)
include $(ROOTDIR)/make.mk

.DEFAULT_GOAL := build

ASDF_VERSION ?= v0.18.0
.PHONY: prepare prepare/asdf prepare/cloc
prepare: sudo
	@command -v asdf >/dev/null 2>&1 || $(MAKE) prepare/asdf
	@command -v cloc >/dev/null 2>&1 || $(MAKE) prepare/cloc
	@awk '!/^#/ && NF {print $$1}' .tool-versions | \
		while read t; do asdf plugin add "$$t" 2>/dev/null || true; done
	@rcfile=$$(mktemp); \
		{ asdf install 2>&1; echo $$? >$$rcfile; } | grep --line-buffered -v 'is already installed' || true; \
		rc=$$(cat $$rcfile); rm -f $$rcfile; exit $$rc
prepare/asdf:
	@command -v brew >/dev/null 2>&1 && brew install asdf || { \
		o=$$(uname | tr A-Z a-z); a=$$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/'); \
		curl -fsSL "https://github.com/asdf-vm/asdf/releases/download/$(ASDF_VERSION)/asdf-$(ASDF_VERSION)-$$o-$$a.tar.gz" \
			| $(SUDO) tar -xz -C /usr/local/bin asdf; \
	}
prepare/cloc:
	@$(PKG_INSTALL) cloc

.PHONY: configure
configure:
	@for cmd in $(GIT) docker curl $(BATS) $(SHFMT); do \
		command -v $$cmd >/dev/null 2>&1 || { echo "$$cmd is missing, run \`make prepare\`"; exit 1; }; \
	done
	@docker info >/dev/null 2>&1 || { echo "the docker daemon is not running"; exit 1; }

# `build` produces the optimized static site in dist/ (vulcanize +
# minify), the same artifact the 2017 release zips shipped. Serving
# for development does not require it; see `serve`.
.PHONY: build
build: configure
	@$(MAKE) -C docker dist

# `serve` runs the legacy dev server (gulp serve: babel + browser-sync
# on port 8801) inside the node 10 container, attached.
.PHONY: serve start
serve: configure
	@$(MAKE) -C docker up
start: serve

.PHONY: stop
stop:
	@$(MAKE) -C docker down

.PHONY: test
test: test/unit

.PHONY: test/unit
test/unit: configure
	@$(MAKE) -C docker test-unit

.PHONY: test/e2e
test/e2e: configure
	@cd tests && export PROJECT_ROOT=$(ROOTDIR) && \
		trap './teardown.sh' EXIT INT TERM; \
		./setup.sh && $(BATS) .

.PHONY: format
format:
	@$(SHFMT) -w tests

.PHONY: lint
lint:
	@$(SHFMT) -d tests

.PHONY: count
count:
	@$(CLOC) $$($(GIT) ls-files)

.PHONY: docker docker/%
docker: FORCE
	@$(MAKE) -C docker
docker/%: FORCE
	@$(MAKE) -C docker $*

.PHONY: clean
clean:
	@rm -rf dist .tmp .publish
	@rm -rf $(MAKEDIR)

.PHONY: purge
purge: clean
	@$(GIT) clean -fxd
