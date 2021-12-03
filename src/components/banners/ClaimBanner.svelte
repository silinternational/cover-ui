<script lang="ts">
import { getClaimState, State } from 'data/states'
import type { ClaimStatus, ReceiptType } from 'data/claims'
import StatusBanner from '../banners/StatusBanner.svelte'

export let claimStatus = '' as ClaimStatus
export let receiptType = '' as ReceiptType
export let isAdmin: boolean = false

$: state = (claimStatus && getClaimState(claimStatus, isAdmin)) || ({} as State)
</script>

<StatusBanner class={$$props.class} {state} {receiptType}><slot /></StatusBanner>
