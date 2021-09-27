<script lang="ts">
import { login } from '../authn'
import { loadUser } from '../authn/user'
import type { CustomError } from '../error'
import './mdc/_index.scss'
import t from '../i18n'
import { parse, stringify } from 'qs'
import { afterPageLoad, Router } from '@roxi/routify'
import { routes } from '../../.routify/routes'

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

$afterPageLoad((page) => {
  if (!publicRoutes.includes(page.path)) {
    authenticateUser()
  }
})
</script>

<svelte:head>
  <title>{t('appname')}</title>
</svelte:head>

<Router {routes} config={{ queryHandler }} />
