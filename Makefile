start: install local-dev

install:
	npm install

local-dev:
	npm run local:dev

local-prod:
	npm run local:prod

build-prod:
	npm run build:prod

clean:
	npm run clean
