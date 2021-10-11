<script lang="ts">
import { getClaimState, State } from 'data/states'
import type { ClaimStatus } from 'data/claims'
import StatusBanner from '../banners/StatusBanner.svelte'

export let claimStatus = '' as ClaimStatus

$: state = (claimStatus && getClaimState(claimStatus)) || ({} as State)
</script>

<StatusBanner class={$$props.class} {state}><slot /></StatusBanner>
