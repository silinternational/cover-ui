<script lang="ts">
/** @type {{label, value, disabled}[]} */
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
.description {
  display: block;
  margin: 0.3em 0 0 2em;
}
.has-description {
  margin-top: -13px;
  margin-bottom: -13px;
}
</style>

{#each options as option (option.value)}
  <label class:has-description={option.description}>
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
      <small class="description">{option.description}</small>
    {/if}
  </label>
{/each}
