.POSIX:
ROOTDIR ?= $(eval ROOTDIR := $(shell git rev-parse --show-toplevel))$(ROOTDIR)
include $(ROOTDIR)/make.mk

.DEFAULT_GOAL := up

COMPOSE_ARGS ?= -f $(ROOTDIR)/docker/compose.yaml

.PHONY: build
build:
	@$(COMPOSE) $(COMPOSE_ARGS) build blogdown

.PHONY: dist
dist: build
	@$(COMPOSE) $(COMPOSE_ARGS) run --rm blogdown npm run dist

.PHONY: test-unit
test-unit: build
	@$(COMPOSE) $(COMPOSE_ARGS) run --rm blogdown npm test

.PHONY: up
up: build
	@$(COMPOSE) $(COMPOSE_ARGS) up

.PHONY: up-d
up-d: build
	@$(COMPOSE) $(COMPOSE_ARGS) up -d --wait --wait-timeout 300

.PHONY: down
down:
	@$(COMPOSE) $(COMPOSE_ARGS) down --volumes --remove-orphans

.PHONY: logs
logs:
	@$(COMPOSE) $(COMPOSE_ARGS) logs -f

.PHONY: ps
ps:
	@$(COMPOSE) $(COMPOSE_ARGS) ps
