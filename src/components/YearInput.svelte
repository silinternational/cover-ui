<!-- https://github.com/material-components/material-components-web/tree/master/packages/mdc-textfield -->
<script lang="ts">
import { isFourDigitYear } from 'helpers/dates'
import { generateRandomID } from '@silintl/ui-components/random'
import { MDCTextField } from '@material/textfield'
import { afterUpdate, onMount } from 'svelte'

export let label = ''
export let value: number | undefined = undefined
export let name = ''
export let autofocus = false
export let disabled = false
export let description = ''
export let required = false
export let showError = false

const step = '1'
const labelID = generateRandomID('year-input-')

let element: HTMLElement
let mdcTextField: MDCTextField
let width = ''
let hasBlurred = false
let hasFocused = false
let isFocused = false

$: isValidYear = isFourDigitYear(value)
$: showValidationMessages = !!(hasFocused && hasBlurred && !isFocused && value)
$: error = showValidationMessages && !isValidYear
$: mdcTextField && (mdcTextField.valid = !error)
$: mdcTextField && (mdcTextField.valid = !showError)

const onBlur = () => {
  hasBlurred = true
  isFocused = false
}

const onFocus = () => {
  hasFocused = true
  isFocused = true
}

onMount(() => {
  mdcTextField = new MDCTextField(element)
  mdcTextField.useNativeValidation = false
  return () => mdcTextField.destroy()
})

afterUpdate(() => (width = `${element?.offsetWidth}px`))

const focus = (node: any) => autofocus && node.focus()
</script>

<label
  class="mdc-text-field mdc-text-field--outlined mdc-text-field--with-leading-icon {$$props.class ||
    ''} textfield-radius"
  class:mdc-text-field--no-label={!label}
  class:mdc-text-field--disabled={disabled}
  class:mdc-text-field--invalid={error || showError}
  class:showError
  class:mdc-text-field--with-leading-icon={error}
  bind:this={element}
>
  <span class="mdc-notched-outline">
    <span class="mdc-notched-outline__leading" />
    {#if label}
      <span class="mdc-notched-outline__notch">
        <span class="mdc-floating-label" class:error id={labelID}>
          {label}
        </span>
      </span>
    {/if}
    <span class="mdc-notched-outline__trailing" />
  </span>
  {#if error}
    <i class="material-icons mdc-text-field__icon mdc-text-field__icon--leading error" aria-hidden="true">error</i>
  {/if}
  <input
    {step}
    type="number"
    class="mdc-text-field__input"
    aria-labelledby={labelID}
    aria-controls="{labelID}-helper-id"
    aria-describedby="{labelID}-helper-id"
    bind:value
    use:focus
    on:focus={onFocus}
    on:blur
    on:blur={onBlur}
    on:keydown
    on:keypress
    on:keyup
    {disabled}
    {name}
    {required}
  />
</label>
<div class="mdc-text-field-helper-line" style="width: {width};">
  <div
    class="mdc-text-field-helper-text"
    class:mdc-text-field-helper-text--validation-msg={error}
    class:mdc-text-field-helper-text--persistent={!error}
    id="{labelID}-helper-id"
    aria-hidden="true"
  >
    {#if !error}
      {description}
    {:else if !isValidYear}
      Must be a four-digit year
    {/if}
  </div>
</div>
