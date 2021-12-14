<!-- https://github.com/material-components/material-components-web/tree/master/packages/mdc-textfield -->
<script lang="ts">
import { MDCTextField } from '@material/textfield'
import { generateRandomID } from '@silintl/ui-components/random'
import { onMount } from 'svelte'

export let label = ''
export let value = ''
export let placeholder = ''
export let maxlength: number = 2048 /* default */
export let autofocus = false
export let disabled = false
export let required = false

const labelID = generateRandomID('text-label-')

let element = {} as Element
let mdcTextField = {} as MDCTextField

$: value && (mdcTextField.value = value)

onMount(() => {
  mdcTextField = new MDCTextField(element)
  return () => mdcTextField.destroy()
})

const focus = (node: any) => autofocus && node.focus()
</script>

<style>
.money-icon {
  width: 24px;
  height: 24px;
  color: rgb(133, 140, 148);
  position: absolute;
  bottom: 15px;
  left: 10px;
}

.label-width {
  width: 269px;
}
.required {
  color: var(--mdc-required-input, var(--mdc-theme-status-error));
  font-size: small;
  margin-left: 1rem;
  margin-top: 0.2rem;
}
</style>

<label
  class="mdc-text-field mdc-text-field--outlined {$$props.class} textfield-radius label-width"
  class:mdc-text-field--no-label={!label}
  class:mdc-text-field--disabled={disabled}
  bind:this={element}
>
  <i class="material-icons money-icon" aria-hidden="true">attach_money</i>
  <input
    step="0.01"
    type="number"
    min="0"
    class="mdc-text-field__input ml-24px"
    aria-labelledby={labelID}
    bind:value
    use:focus
    on:blur
    {maxlength}
    {disabled}
    {placeholder}
    {required}
  />
  <span class="mdc-notched-outline">
    <span class="mdc-notched-outline__leading" style="width:35px;" />
    {#if label}
      <span class="mdc-notched-outline__notch">
        <span class="mdc-floating-label" id={labelID}>{label}</span>
      </span>
    {/if}
    <span class="mdc-notched-outline__trailing" />
  </span>
</label>
{#if required && !value}
  <div class="required">*Required</div>
{/if}
