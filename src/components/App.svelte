<script lang="ts">
import { login } from '../authn'
import user, { loadUser } from '../authn/user'
import type { CustomError } from '../error'
import './mdc/_index.scss'
import { parse, stringify } from 'qs'
import { afterPageLoad, Router } from '@roxi/routify'
import { routes } from '../../.routify/routes'
import { Snackbar } from '@silintl/ui-components'
import { updatePageTitle, pageTitle } from 'helpers/pageTitle'

// If we've loaded the user, but their policy wasn't quite ready, try again.
$: if (!$user.policy_id) {
  setTimeout(loadUser, 5000)
}

// added because of this:  https://github.com/sveltech/routify/issues/201
const queryHandler = {
  parse: (params: string) => parse(params, { ignoreQueryPrefix: true }),
  stringify,
}

const publicRoutes = ['/invite/:uuid']

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
  updatePageTitle(page.path)
})
</script>

<svelte:head>
  <title>{$pageTitle}</title>
</svelte:head>

<Router {routes} config={{ queryHandler }} />

<Snackbar />
