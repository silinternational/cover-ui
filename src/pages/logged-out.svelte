<script>
import user from '../authn/user'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

$: stillLoggedIn = !! $user.id
$: if (stillLoggedIn) {
  setTimeout(() => $goto('/home'), 3000)
}
</script>

<Page>
  <p>
    {#if stillLoggedIn}
      It looks like you're still logged in. Sending you home!
    {:else}
      You have successfully logged out.
    {/if}
  </p>
</Page>
