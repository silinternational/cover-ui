<script lang="ts">
import StatusBanner from '../banners/StatusBanner.svelte'
import { getClaimState, type SecondaryClaimStatus, type State } from 'data/states'
import type { ClaimStatus, ReceiptType } from 'data/claims'
import { UserAppRole } from 'data/user'

export let claimStatus: ClaimStatus | SecondaryClaimStatus
export let receiptType: ReceiptType | undefined = undefined
export let roleSelection: UserAppRole = UserAppRole.Customer

$: state = (claimStatus && getClaimState(claimStatus, roleSelection)) || ({} as State)
</script>

<StatusBanner class={$$props.class} {state} {receiptType}><slot /></StatusBanner>
