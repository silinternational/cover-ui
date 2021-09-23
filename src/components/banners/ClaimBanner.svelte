<script lang="ts">
import { getClaimState, State } from '../../data/states'
import type { ClaimStatus } from '../../data/claims'
import { StatusBanner } from '../index'

export let claimStatus = '' as ClaimStatus

$: state = (claimStatus && getClaimState(claimStatus)) || ({} as State)
</script>

<StatusBanner {state}><slot /></StatusBanner>
