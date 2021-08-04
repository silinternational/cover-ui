<script>
/** @type {{label, value}[]} */
export let options = []

export let name
export let value

const onInput = event => {
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
    <input type="radio" {name} value={option.value} on:input={onInput} />
    {option.label}
    {#if option.description}
      <small>{option.description}</small>
    {/if}
  </label>
{/each}
