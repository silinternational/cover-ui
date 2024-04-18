<script lang="ts">
import RadioOptions from '../../../RadioOptions.svelte'
import { claimIncidentTypes } from 'data/types/claim-incident-types'

export let lossReason: string
export let showError: boolean = false

let lossReasonOptions: { label: string; value: string }[] = []

// Calculate dynamic options for radio-button prompts.
$: lossReasonOptions = $claimIncidentTypes.map(({ name, description }) => ({ label: name, value: name, description }))
</script>

<p>
  <span class="header">Reason for loss or damage</span>
  <RadioOptions required name="lossReason" options={lossReasonOptions} {showError} bind:value={lossReason} on:change />
</p>
