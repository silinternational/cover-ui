<script lang="ts">
import { throwError } from '../../error/index'
import type Filter from './filter'
import { writable } from 'svelte/store'

export let filters: Filter[]
export let items: any[]

let filteredItems = writable(items)

if (!filters || !items) {
  throwError('Error: `filters` and `items` parameter are required for this component')
}

$: applyFilters(filters)

const applyFilters = (filters: Filter[]) => {
  filters.forEach((filter) => {
    filteredItems.update(() => {
      return filter.filter(items)
    })
  })
}
</script>

<slot items={$filteredItems} />
