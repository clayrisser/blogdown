CWD := $(shell readlink -en $(dir $(word $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST))))

.PHONY: all
all: fetch_dependancies build sweep push

.PHONY: build
build:
	# docker pull jamrizzi/blogdown
	docker build -t thingdown/blogdown:latest -f $(CWD)/deployment/Dockerfile $(CWD)
	$(info built myproject)

.PHONY: push
push:
	docker push thingdown/blogdown:latest
	$(info pushed thingdown/blogdown:latest)

.PHONY: clean
clean: sweep bleach
	$(info cleaned)
.PHONY: sweep
sweep:
	$(info swept)
.PHONY: bleach
bleach:
	$(info bleached)

.PHONY: fetch_dependancies
fetch_dependancies: docker
	$(info fetched dependancies)
.PHONY: docker
docker:
ifeq ($(shell whereis docker), $(shell echo docker:))
	curl -L https://get.docker.com/ | bash
endif
	$(info fetched docker)
