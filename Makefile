start: install local-dev

docker:
	docker-compose run --rm app npm install
	docker-compose run --rm --service-ports app

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

bun:
	bun install
	bun run bun:dev
