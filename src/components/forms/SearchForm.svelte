<script lang="ts">
import { MAX_INPUT_LENGTH as maxlength } from 'components/const'
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
  <TextField
    {maxlength}
    bind:value={searchFieldContents}
    on:keydown={onKeydown}
    label="Search"
    icon="search"
    name="searchField"
  />
</Form>
