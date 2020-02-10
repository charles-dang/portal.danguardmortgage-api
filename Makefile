.DEFAULT_GOAL := build

IMAGE_NAME=application

#Build docker image by first perform npm install outside.  We do not want to perform npm install inside Dockerfile due to layering effect
build:
	sudo docker-compose -f docker/common-services.yml run --rm build npm install
	sudo docker build -t $(IMAGE_NAME) .

#Run the built application
run:
	docker-compose -f docker/common-services.yml run --service-ports --rm application node ./src/index.js

#Run 
run-dev:
	docker-compose -f docker/common-services.yml -f docker/dev.yml run --service-ports --rm application

test-unit:
	sudo docker-compose -f docker/common-services.yml --service-ports -f docker/test.yml run --rm unit

test-integration:
	sudo docker-compose -f docker/common-services.yml -f docker/test.yml run --rm integration

test: 
	make test-unit
	make test-integration

 .PHONY: test