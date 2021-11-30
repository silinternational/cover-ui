<script lang="ts">
import { login } from '../authn'
import user, { isCustomer, loadUser } from '../authn/user'
import type { CustomError } from '../error'
import './mdc/_index.scss'
import t from '../i18n'
import FreshdeskWidget from './FreshdeskWidget.svelte'
import { parse, stringify } from 'qs'
import { afterPageLoad, route, Router } from '@roxi/routify'
import { routes } from '../../.routify/routes'
import { Snackbar } from '@silintl/ui-components'
import { setLastPath } from '../authn/session'

// If we've loaded the user, but their policy wasn't quite ready, try again.
$: if (!($user.policies?.length > 0) && isCustomer($user.app_role)) {
  //TODO remove this when fixed on the backend
  setTimeout(() => loadUser(true), 5000)
}

$: $route && $user && setLastPath(location.pathname)

// added because of this:  https://github.com/sveltech/routify/issues/201
const queryHandler = {
  parse: (params: string) => parse(params, { ignoreQueryPrefix: true }),
  stringify,
}

const publicRoutes = ['/invite/:uuid', '/privacy']

const authenticateUser = async () => {
  loadUser().catch((error: CustomError) => {
    if (error.status === 401) {
      login()
    }
  })
}

$afterPageLoad((page: { path: string }) => {
  if (!publicRoutes.includes(page.path)) {
    authenticateUser()
  }
})
</script>

<svelte:head>
  <title>{t('appname')}</title>
</svelte:head>

<Router {routes} config={{ queryHandler }} />

<Snackbar />

<FreshdeskWidget />
