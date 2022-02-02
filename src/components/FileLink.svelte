<script type="ts">
  import type { CoverFile } from 'data/file'
  import { onMount } from 'svelte'

  export let file: CoverFile

  onMount(() => {
    setTimeout(onTimeout, new Date(file.url_expiration) - new Date())
  })

  let expired = new Date(file.url_expiration) < new Date()
  const onTimeout = () => {
    expired = true
  }

  $: url = !expired && file.url || null
  $: filename = file?.name || '-'
</script>

<a href={url}>{filename}</a>
