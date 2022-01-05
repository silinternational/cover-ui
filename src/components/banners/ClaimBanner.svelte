<script lang="ts">
import StatusBanner from '../banners/StatusBanner.svelte'
import { getClaimState, SecondaryClaimStatus, State } from 'data/states'
import type { ClaimStatus, ReceiptType } from 'data/claims'
import type { UserAppRole } from 'data/user'

export let claimStatus: ClaimStatus | SecondaryClaimStatus
export let receiptType: ReceiptType
export let roleSelection: UserAppRole

$: state = (claimStatus && getClaimState(claimStatus, roleSelection)) || ({} as State)
</script>

<StatusBanner class={$$props.class} {state} {receiptType}><slot /></StatusBanner>
