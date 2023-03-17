<script lang="ts">
import RadioOptions from '../../../RadioOptions.svelte'

export let repairableSelection: string | undefined
export let potentiallyRepairable: boolean
export let lossReason: string

let shouldAskIfRepairable = false

const repairableOptions = [
  {
    label: 'Repairable',
    value: 'repairable',
  },
  {
    label: 'Not Repairable',
    value: 'not_repairable',
  },
]

$: shouldAskIfRepairable = !!(potentiallyRepairable && lossReason)
$: !shouldAskIfRepairable && unSetRepairableSelection()

function unSetRepairableSelection() {
  repairableSelection = undefined
}
</script>

{#if shouldAskIfRepairable}
  <div>
    <RadioOptions name="repairableSelection" options={repairableOptions} bind:value={repairableSelection} />
  </div>
{/if}
