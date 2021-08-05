<script>
import { logout } from '../authn'
import { GET } from '../data'
import { onMount } from 'svelte'
import user from '../authn/user'

onMount(async () => {
  await GET('bearer')  // this helps simulate a page accessed that may require the user be authenticated
})
</script>

<p>
  home 
</p>

<p>
  {#if $user.id}
    Welcome {$user.first} {$user.last} ({$user.email})
  {/if}
  
  <button on:click={logout}>logout (simulated)</button>
</p>
