<script lang="ts">
import type { CoverFile } from 'data/file'

export let file: CoverFile

let expired

$: url = (!expired && file?.url) || undefined
$: filename = file?.name || '-'
$: expiration = file?.url_expiration && new Date(file.url_expiration)
$: expiration && setTimeout(() => (expired = true), expiration - new Date())
</script>

<a href={url}>{filename}</a>
