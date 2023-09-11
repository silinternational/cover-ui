# Cover-UI

> You will need [Bun](https://bun.sh/docs/installation) and optionally [make](https://www.npm.com/package/make) installed.

## env variables

Run the following command from the project root directory in your terminal:

```bash
cp .env.example .env
```

Set the necessary variables. Ask another team member if you think you are
missing any. You will at least need...

```
API_HOST=//cover.local:3000
```

Add `127.0.0.1 cover.local` to `/etc/hosts` (or equivalent for your OS)

## Local development

Install the dependencies...

```bash
bun i
```

...then start [Rollup](https://rollupjs.org):

```bash
bun run local:dev
```

or

```bash
make
```

Navigate to <http://cover.local:8081>. You should see your app running app
_(configured to auto-reload page for any changes)_.

## Local development using Docker

Install the dependencies...

```bash
docker-compose run --rm app bun install
```

...then start [Rollup](https://rollupjs.org):

```bash
docker-compose up -d app
docker-compose logs -f app
```

or, to run the install and dev scripts in sequence

```bash
make docker
```

Navigate to <http://cover.local:8081>. You should see your app running app. It will auto-rebuild on code changes.

### Running in prod mode

```bash
bun run local:prod
```

or

```bash
make local-prod
```

> NOTE: This mode will _not_ auto-reload when making changes in `src`.

### Clean up

```bash
bun run clean
```

or

```bash
make clean
```

## Deployment

Build the optimized app...

```bash
bun run build:prod
```

or

```bash
make build-prod
```

...then deploy contents of `dist` to your host.

## Icons

This code uses Material Design icons. To search for additional icons, go here:
<https://fonts.google.com/icons>
