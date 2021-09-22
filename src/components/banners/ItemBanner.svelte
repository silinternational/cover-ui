<script lang="ts">
import { getItemState, State } from '../../data/states'
import type { ItemCoverageStatus } from '../../data/items'
import { FormattedBanner } from '../index'

export let itemStatus = '' as ItemCoverageStatus

$: state = (itemStatus && getItemState(itemStatus)) || ({} as State)
</script>

<FormattedBanner {state}><slot /></FormattedBanner>
