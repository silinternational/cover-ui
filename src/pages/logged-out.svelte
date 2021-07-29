<script>
import user from '../authn/user'
import { goto } from '@roxi/routify'

$: stillLoggedIn = !! $user.id
$: if (stillLoggedIn) {
  setTimeout(() => $goto('home'), 3000)
}
</script>

<p>
  {#if stillLoggedIn}
    looks like you're still logged in, sending you home!
  {:else}
    logged out
  {/if}
</p>
