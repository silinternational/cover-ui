<script lang="ts">
import { login } from '../authn'
import { loadUser } from '../authn/user'
import './mdc/_index.scss'
import t from '../i18n'
import { parse, stringify } from 'qs'
import { Router } from "@roxi/routify"
import { onMount } from 'svelte'
import { routes } from '../../.routify/routes'
// added because of this:  https://github.com/sveltech/routify/issues/201
const queryHandler = {
  parse: params => parse(params, {ignoreQueryPrefix: true}),
  stringify
}
onMount(() => {
  loadUser().catch(error => {
    if (error.code === 401) {
      login()
    }
  })
})
</script>

<svelte:head>
  <title>{t('appname')}</title>
</svelte:head>

<Router {routes} config={{queryHandler}} />
