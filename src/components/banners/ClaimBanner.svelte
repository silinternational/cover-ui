<script lang="ts">
import { getClaimState, State } from '../../data/states'
import type { ClaimStatus } from '../../data/claims'
import { FormattedBanner } from '../index'

export let claimStatus = '' as ClaimStatus

$: state = (claimStatus && getClaimState(claimStatus)) || ({} as State)
</script>

<FormattedBanner {state}><slot /></FormattedBanner>
