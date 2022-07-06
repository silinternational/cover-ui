<script lang="ts">
export let value = ''
export let disabled = false
export let autofocus = false
export let padding = '12px'
export let width = '220px'

const focus = (node) => autofocus && node.focus()
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

.custom-field {
  font-size: 14px;
  position: relative;
  border-top: 20px solid transparent;
}

.custom-field input {
  border-radius: 8px;
  border: 1px solid gray;
  padding: var(--field-padding);
  font-family: var(--mdc-typography-font-family);
}
</style>

<label class="{$$props.class} custom-field" style:--field-padding={padding} {disabled}>
  <input type="date" class="fs-14" style:width bind:value on:blur use:focus {disabled} />
</label>
