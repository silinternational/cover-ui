<script lang="ts">
type RadioOption = {
  label: string
  value?: string
  disabled?: boolean
  description?: string
}
export let options: RadioOption[] = []

export let name: string
export let value: string | undefined

const onInput = (event: any) => {
  value = event?.target?.value
}
const isSelected = (option: RadioOption) => option.value === value
const optionId = (option: RadioOption) => `radio-options-${String(option.value).toLowerCase().replace(' ', '-')}`
</script>

<style>
.description {
  display: block;
}
input {
  margin-right: 0.3rem;
  margin-bottom: 0.2rem;
}
</style>

{#each options as option (option.value)}
  <div class="flex align-items-center my-1">
    <input
      type="radio"
      {name}
      id={optionId(option)}
      disabled={option.disabled}
      value={option.value}
      checked={isSelected(option)}
      on:input={onInput}
      on:change
    />
    <label for={optionId(option)}>
      {option.label}
      {#if option.description}
        <small class="description">{option.description}</small>
      {/if}
    </label>
  </div>
{/each}
