<script lang="ts">
import { login } from '../../authn'
import { loading } from 'components/progress'
import { Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let uuid: string

onMount(() => {
  login(uuid)
})
</script>

<Page>
  {#if $loading}
    <p>Processing invitation...</p>
  {/if}
</Page>
