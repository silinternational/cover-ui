<script lang="ts">
import { createEventDispatcher } from 'svelte'
import { Form, TextField } from '@silintl/ui-components'

const dispatch = createEventDispatcher()

export let initial = ''

let searchFieldContents: string
$: searchFieldContents = initial

const onSubmit = () => dispatch('search', searchFieldContents)
</script>

<Form on:submit={onSubmit}>
  Search:
  <TextField bind:value={searchFieldContents} />
</Form>
