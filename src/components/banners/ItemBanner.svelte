<script lang="ts">
import { getItemState, State } from 'data/states'
import type { ItemCoverageStatus } from 'data/items'
import StatusBanner from './StatusBanner.svelte'

export let itemStatus = '' as ItemCoverageStatus
export let isAdmin: boolean = false

$: state = (itemStatus && getItemState(itemStatus, isAdmin)) || ({} as State)
</script>

<StatusBanner class={$$props.class} {state}><slot /></StatusBanner>
