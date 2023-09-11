start: install local-dev

docker:
	docker-compose run --rm app bun install
	docker-compose run --rm --service-ports app

install:
	bun install

local-dev:
	bun run local:dev

local-prod:
	bun run local:prod

build-prod:
	bun run build:prod

clean:
	bun run clean
