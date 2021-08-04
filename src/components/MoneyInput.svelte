<!-- https://github.com/material-components/material-components-web/tree/master/packages/mdc-textfield -->
<script>
import { MDCTextField } from '@material/textfield'
import { generateRandomID } from '@silintl/ui-components/random'
import { onMount } from 'svelte'

export let label = ''
export let value = ''
export let placeholder = ''
export let maxlength = undefined
export let autofocus = false
export let disabled = false

const labelID = generateRandomID('text-label-')

let element = {}
let mdcTextField = {}

$: mdcTextField.value = value

onMount(() => {
  mdcTextField = new MDCTextField(element)
  return () => mdcTextField.destroy()
})

const focus = node => autofocus && node.focus()
</script>

<style>
.NotoSans {
  font-family: 'Noto Sans' !important;
}

.money-icon {
  width: 24px;
  height: 24px;
  color: rgb(133, 140, 148);
  position: absolute;
  bottom: 18px;
  left: 10px;
}

.m-l-24px {
  margin-left: 24px;
}

.label-width {
  width: 269px;
}
</style>

<label class="mdc-text-field mdc-text-field--outlined {$$props.class} textfield-radius label-width"
        class:mdc-text-field--no-label={!label}
        class:mdc-text-field--disabled={disabled}
        bind:this={element}>
  <svg class="money-icon" viewBox="0 0 20 20">
    <path fill="currentColor" d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z" />
  </svg>
  <input step="0.01" type="number" min="0" class="mdc-text-field__input NotoSans m-l-24px" aria-labelledby={labelID} bind:value use:focus on:blur {maxlength} {disabled} {placeholder}>
  <span class="mdc-notched-outline">
    <span class="mdc-notched-outline__leading" style="width:35px;"></span>
    {#if label}
      <span class="mdc-notched-outline__notch">
        <span class="mdc-floating-label" id={labelID}>{label}</span>
      </span>
    {/if}
    <span class="mdc-notched-outline__trailing"></span>
  </span>
</label>