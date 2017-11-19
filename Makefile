SHELL := /bin/bash
CWD := $(shell pwd)
VERSION := "0.1.10"
IMAGE := "thingdown/blogdown:latest"
SOME_CONTAINER := $(shell echo some-$(IMAGE) | sed 's/[^a-zA-Z0-9]//g')
DOCKERFILE := $(CWD)/Dockerfile

.PHONY: all
all: clean deps build

.PHONY: start
start:
	@yarn start

.PHONY: build
build: blogdown.zip build_docker
	@echo ::: Built :::

.PHONY: publish
publish: blogdown.zip release
	@echo ::: Published :::

dist: app
	@echo Building: dist
	@yarn build

.PHONY: release
release:
	@echo Releasing: v$(VERSION)
	@github-release release --user thingdown --repo blogdown --tag v$(VERSION) --name v$(VERSION) --description "Released $(VERSION)"
	@github-release upload --replace --user thingdown --repo blogdown --tag v$(VERSION) --name blogdown.zip --file $(CWD)/blogdown.zip

.PHONY: demo
demo:
	@echo Releasing: demo
	@yarn demo

.PHONY: test
test:
	@yarn test

blogdown.zip: dist
	@echo Building: blogdown.zip
	@mv $(CWD)/dist/ $(CWD)/blogdown/
	@zip -r -9 blogdown.zip ./blogdown/
	@mv $(CWD)/blogdown/ $(CWD)/dist/

.PHONY: build_docker
build_docker:
	@docker build -t $(IMAGE) -f $(DOCKERFILE) $(CWD)
	@echo ::: Built Docker Image :::

.PHONY: pull
pull:
	@docker pull $(IMAGE)
	@echo ::: Pulled :::

.PHONY: push
push:
	@docker push $(IMAGE)
	@echo ::: Pushed :::

.PHONY: run
run:
	@echo Running: $(IMAGE)
	@docker run --name $(SOME_CONTAINER) --link some-prerender:prerender --rm -p 8081:8081 $(IMAGE)

.PHONY: ssh
ssh:
	@dockssh $(IMAGE)

.PHONY: essh
essh:
	@dockssh -e $(SOME_CONTAINER)

.PHONY: clean
clean:
	-@rm -rf ./blogdown.zip &>/dev/null || true
	@yarn clean && yarn run clean
	@echo ::: Cleaned :::

.PHONY: deps
deps: docker
	@echo ::: Fetched Deps :::
.PHONY: docker
docker:
ifeq ($(shell whereis docker), $(shell echo docker:))
	curl -L https://get.docker.com/ | bash
endif
