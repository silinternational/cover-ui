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
.description {
  display: block;
}
#radio {
  margin-right: 0.3rem;
  margin-bottom: 0.2rem;
}
</style>

{#each options as option (option.value)}
  <div class="flex align-items-center my-1">
    <input
      type="radio"
      {name}
      id="radio"
      disabled={option.disabled}
      value={option.value}
      checked={isSelected(option)}
      on:input={onInput}
    />
    <label for="radio">
      {option.label}
      {#if option.description}
        <small class="description">{option.description}</small>
      {/if}
    </label>
  </div>
{/each}
