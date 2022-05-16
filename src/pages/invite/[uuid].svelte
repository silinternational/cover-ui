<script lang="ts">
import { login } from '../../authn'
import { loading } from 'components/progress'
import { error } from '../../error'
import { Page, Progress } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let uuid: string

onMount(() => {
  login(uuid)
})
</script>

<Page>
  {#if $loading}
    <p class="m-0-auto">Processing invitation...</p>
  {:else if $error.key === 'ErrorProcessingAuthInviteCode'}
    <p class="m-0-auto">That invite code is invalid or too old</p>
  {:else if !$error.status}
    <p class="m-0-auto">
      Redirecting to login...

      <Progress.Circular />
    </p>
  {:else}
    <p class="m-0-auto">An error has occurred. Try refreshing the page or go <a href="/">home</a></p>
  {/if}
</Page>
