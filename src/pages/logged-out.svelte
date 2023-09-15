<script lang="ts">
import { logout } from '../authn'
import user from 'data/user'
import { params } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

$: stillLoggedIn = !!$user.id
$: if (stillLoggedIn) {
  setTimeout(() => logout(), 3000)
}
</script>

<Page>
  <p>
    {#if $params.appError}
      There was an unexpected problem while processing your login. Please contact Cover support for assistance.
    {:else if stillLoggedIn}
      It looks like you're still logged in. Logging you out...
    {:else}
      You have successfully logged out.
    {/if}
  </p>
</Page>
