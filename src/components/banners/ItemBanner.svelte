<script lang="ts">
import { getItemState, State } from 'data/states'
import type { ItemCoverageStatus } from 'data/items'
import StatusBanner from './StatusBanner.svelte'

export let itemStatus = '' as ItemCoverageStatus

$: state = (itemStatus && getItemState(itemStatus)) || ({} as State)
</script>

<StatusBanner class={$$props.class} {state}><slot /></StatusBanner>
