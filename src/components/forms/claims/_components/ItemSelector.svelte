<script lang="ts">
import type { PolicyItem } from 'data/items'
import { Select } from '@silintl/ui-components'

export let items: PolicyItem[] = []

let selectedID: string

$: options = items.map((item) => ({ id: item.id, name: item.name }))

const onPopulated = () => {
  selectedID = options[0].id
}
</script>

<p>
  <Select label="Item" {selectedID} {options} on:change on:populated={onPopulated} />
</p>
