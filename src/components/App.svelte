<script lang="ts">
import { login, showApp } from '../authn'
import user, { isCustomer, loadUser } from 'data/user'
import type { CustomError } from '../error'
import { LOGGEDOUT, LOGOUT, PRIVACY_POLICY, TERMS_OF_SERVICE } from 'helpers/routes'
import './mdc/_index.scss'
import t from '../i18n'
import FreshdeskWidget from './FreshdeskWidget.svelte'
import { afterPageLoad, Router } from '@roxi/routify'
import { routes } from '../../.routify/routes'
import { Snackbar } from '@silintl/ui-components'

// If we've loaded the user, but their policy wasn't quite ready, try again.
$: if (!($user.policies?.length > 0) && isCustomer($user.app_role)) {
  //TODO remove this when fixed on the backend
  setTimeout(() => loadUser(true), 5000)
}

const publicRoutes = ['/invite/:uuid', PRIVACY_POLICY, TERMS_OF_SERVICE, LOGGEDOUT, LOGOUT]

const authenticateUser = async () => {
  loadUser()
    .catch((error: CustomError) => {
      if (error.status === 401) {
        login()
      }
    })
    .then(() => {
      if ($user.policies?.length > 0) $showApp = true
    })
}

$afterPageLoad((page: { path: string }) => {
  if (!publicRoutes.includes(page.path)) {
    authenticateUser()
  } else {
    $showApp = true
  }
})
</script>

<svelte:head>
  <title>{t('appname')}</title>
</svelte:head>

<Router {routes} />

<Snackbar />

<FreshdeskWidget />
