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
export let required: boolean = false
export let showError: boolean = false

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
  margin-right: 0.6rem;
  margin-bottom: 0.2rem;
}
.showError {
  color: var(--mdc-theme-error);
}
</style>

{#each options as option (option.value)}
  <div class="flex align-items-center my-1">
    <input
      {required}
      type="radio"
      {name}
      id={optionId(option)}
      disabled={option.disabled}
      value={option.value}
      checked={isSelected(option)}
      on:input={onInput}
      on:change
    />
    <label class:showError for={optionId(option)}>
      {option.label}
      {#if option.description}
        <small class="description">{option.description}</small>
      {/if}
    </label>
  </div>
{/each}
