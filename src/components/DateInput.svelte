<script>
import { MDCTextField } from '@material/textfield'
import { onMount } from 'svelte'

export let value = ''
export let disabled = false
export let autofocus = false

let element = {}
let mdcTextField = {}

onMount(() => {
  mdcTextField = new MDCTextField(element)
  return () => mdcTextField.destroy()
})

const focus = node => autofocus && node.focus()
</script>

<style>

.input-label {
    width: 228px;
}

.date-input {
    padding-right: 60px;
}
</style>

<label class="mdc-text-field mdc-text-field--outlined {$$props.class} textfield-radius input-label"
       class:mdc-text-field--disabled={disabled}
       bind:this={element}>
  <input type="date" class="mdc-text-field__input NotoSans date-input" bind:value on:blur use:focus {disabled}>
  <span class="mdc-notched-outline">
    <span class="mdc-notched-outline__leading"></span>
    <span class="mdc-notched-outline__trailing"></span>
  </span>
</label>