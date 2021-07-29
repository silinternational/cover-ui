# riskman-ui

> You will need [Node.js](https://nodejs.org) installed.

## Local development
Install the dependencies...
```bash
npm i
```

...then start [Rollup](https://rollupjs.org):
```bash
npm run local:dev
```

Navigate to [localhost:8080](http://localhost:8080). You should see your app running app _(configured to auto-reload page for any changes)_

### Running in prod mode
```bash
npm run local:prod
```

> this mode will *not* auto-reload when making changes in `src`

### Clean up
```bash
npm run clean
```

## Deployment
Build the optimized app...
```bash
npm run build:prod
```

...then deploy contents of `dist` to your host.