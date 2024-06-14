<script lang="ts">
import { Datatable } from '@silintl/ui-components'
import { noCoverage } from 'components/Datatable/PolicyItems/itemTableHelpers'
import type { ItemCoverageStatus } from 'data/types/items'

export let status = '' as ItemCoverageStatus
export let numeric = false
export let className = ''
</script>

<Datatable.Data.Row.Item class={className} lowContrast={noCoverage(status)} {numeric}>
  <slot />
</Datatable.Data.Row.Item>
