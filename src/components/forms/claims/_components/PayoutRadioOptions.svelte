<script lang="ts">
import RadioOptions from '../../../RadioOptions.svelte'
import { PayoutOption } from 'data/claims'

export let payoutOption: PayoutOption | undefined

const payoutOptions = [
  {
    label: 'Replace and get reimbursed later',
    value: PayoutOption.Replacement,
  },
  {
    label: 'Get fair market value (no replacement)',
    value: PayoutOption.FMV,
  },
]
</script>

<div>
  <span class="header">Payout options</span>
  <RadioOptions name="payoutOption" options={payoutOptions} bind:value={payoutOption} />
</div>
