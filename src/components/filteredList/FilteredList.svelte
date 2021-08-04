<script>
import { throwError } from '../../error/index.js'
import { writable } from 'svelte/store';

export let filters
export let items

let filteredItems = writable(items)

if (!filters || !items) {
  throwError(new Error("`filters` and `items` parameter are required for this component"))
}

$: applyFilters(filters)

const applyFilters = (filters) => {
  filters.forEach(filter => {
    filteredItems.update(() => {
      return filter.filter(items)
    })
  })
}
</script>

<slot items={$filteredItems} />