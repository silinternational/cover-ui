<script lang="ts">
import { debounce } from 'lodash-es'
import { createEventDispatcher } from 'svelte'
import { Form, TextField } from '@silintl/ui-components'

const dispatch = createEventDispatcher()

export let initial = ''

let searchFieldContents: string
$: searchFieldContents = initial

const onKeydown = debounce(() => dispatch('search', searchFieldContents), 500)
</script>

<Form>
  Search:
  <TextField bind:value={searchFieldContents} on:keydown={onKeydown} />
</Form>
