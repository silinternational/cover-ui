<script lang="ts">
import { Datatable } from '@silintl/ui-components'
import { noCoverage } from 'components/forms/items/itemTableHelpers'
import type { PolicyItem } from 'data/items'

export let item: PolicyItem
export let numeric = false

const getRowClass = (item: PolicyItem) => {
  if (noCoverage(item.coverage_status)) return 'low-contrast'
}
</script>

<Datatable.Data.Row.Item class={getRowClass(item)} {numeric}>
  <slot />
</Datatable.Data.Row.Item>
