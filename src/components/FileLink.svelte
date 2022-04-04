<script lang="ts">
import type { CoverFile } from 'data/file'
import { createEventDispatcher } from 'svelte'

export let file: CoverFile

let expired: boolean = false

const dispatch = createEventDispatcher<{ expired: string }>()

$: url = (!expired && file?.url) || undefined
$: filename = file?.name || '-'
$: expiration = file?.url_expiration && Number(new Date(file.url_expiration))
$: expiration && setTimeout(() => (expired = true), expiration - Number(new Date()))
$: expired && dispatch('expired')
</script>

<a href={url}>{filename}</a>
