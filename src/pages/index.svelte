<script lang="ts">
import { HOME } from 'helpers/routes'
import { params, redirect } from '@roxi/routify'
import { onMount } from 'svelte'

onMount(() => {
  const returnTo = $params['return-to']
  if (returnTo) {
    $redirect(returnTo)
  } else {
    $redirect(HOME)
  }
})
</script>
