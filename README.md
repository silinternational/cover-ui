# Cover-UI

> You will need [Node.js](https://nodejs.org) and optionally [make](https://www.npmjs.com/package/make) installed.

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

## Local development using npm

Install the dependencies...

```bash
npm i
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run local:dev
```

or

```bash
make
```

## Local development using bun

Install the dependencies...

```bash
bun i
```

...then start [Rollup](https://rollupjs.org):

```bash
bun run bun:dev
```

or

```bash
make bun
```

Note: this won't update package-lock.json so if you change dependencies you will need to run `npm install` to do so.

Navigate to <http://cover.local:8081>. You should see your app running app
_(configured to auto-reload page for any changes)_.

## Local development using Docker

Install the dependencies...

```bash
docker-compose run --rm app npm install
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
npm run local:prod
```

or

```bash
make local-prod
```

> NOTE: This mode will _not_ auto-reload when making changes in `src`.

### Clean up

```bash
npm run clean
```

or

```bash
make clean
```

## Deployment

Build the optimized app...

```bash
npm run build:prod
```

or

```bash
make build-prod
```

...then deploy contents of `dist` to your host.

## Icons

This code uses Material Design icons. To search for additional icons, go here:
<https://fonts.google.com/icons>
