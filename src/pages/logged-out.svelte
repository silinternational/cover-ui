<script>
import { logout } from '../authn'
import user from '../authn/user'
import { Page } from '@silintl/ui-components'

$: stillLoggedIn = !! $user.id
$: if (stillLoggedIn) {
  setTimeout(() => logout(), 3000)
}
</script>

<Page>
  <p>
    {#if stillLoggedIn}
      It looks like you're still logged in. Logging you out...
    {:else}
      You have successfully logged out.
    {/if}
  </p>
</Page>
