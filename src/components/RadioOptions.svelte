<script>
import Description from "./Description.svelte"

export let options = []
export let name
export let value

const onInput = event => {
  value = event.target.value
}
</script>

{#each options as option (option.value)}
  <p>
    <label>
      <input type="radio" {name} value={option.value} on:input={onInput} />
      {option.label}
      {#if option.description}
        <Description>{option.description}</Description>
      {/if}
    </label>
  </p>
{/each}
