<script lang="ts">
import { MAX_INPUT_LENGTH as maxlength } from './const'
import { TextField } from '@silintl/ui-components'

export let description: string = ''
export let label: string = ''
export let required: boolean = false
export let value: string = ''
</script>

<style>
.label {
  display: block;
  margin-bottom: 0.5rem;
}
</style>

{#if label}
  <span class="label">
    {label}
    {#if required}
      <span class="error">*</span>
    {/if}
  </span>
{/if}
<TextField class="mw-300" {required} {description} {maxlength} bind:value />
