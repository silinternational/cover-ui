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

## Local development

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

Navigate to <http://cover.local:8081>. You should see your app running app
_(configured to auto-reload page for any changes)_.

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
