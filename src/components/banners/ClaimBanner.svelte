<script lang="ts">
import { getClaimState, SecondaryClaimStatus, State } from 'data/states'
import type { ClaimStatus, ReceiptType } from 'data/claims'
import StatusBanner from '../banners/StatusBanner.svelte'

export let claimStatus: ClaimStatus | SecondaryClaimStatus
export let receiptType: ReceiptType
export let isAdmin: boolean = false

$: state = (claimStatus && getClaimState(claimStatus, isAdmin)) || ({} as State)
</script>

<StatusBanner class={$$props.class} {state} {receiptType}><slot /></StatusBanner>
