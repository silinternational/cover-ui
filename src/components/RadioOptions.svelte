<script lang="ts">
/** @type {{label, value}[]} */
export let options = []

export let name: string
export let value: string | undefined

const isSelected = (option) => {
  return option.value === value ? 'checked' : undefined
}
const onInput = (event) => {
  value = event.target.value
}
</script>

<style>
label {
  display: block;
  margin: 1rem 0;
}
</style>

{#each options as option (option.value)}
  <label>
    <input
      type="radio"
      {name}
      disabled={option.disabled}
      value={option.value}
      checked={isSelected(option)}
      on:input={onInput}
    />
    {option.label}
    {#if option.description}
      <small>{option.description}</small>
    {/if}
  </label>
{/each}
