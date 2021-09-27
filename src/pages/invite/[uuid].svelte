<script lang="ts">
import { loading } from '../../components/progress'
import { CREATE } from '../../data'
import { Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let uuid: string

onMount(async () => {
  const response = await CREATE(`auth/login?invite=${encodeURIComponent(uuid)}`)

  console.log(response) // TODO: Properly handle the API's response.
})
</script>

<Page>
  {#if $loading}
    <p>Processing invitation...</p>
  {/if}
</Page>
