<script>
import RadioOptions from './RadioOptions.svelte'
import { Button, Form, TextField } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let uuid = undefined

const dispatch = createEventDispatcher()
const relationshipOptions = [
  {
    label: 'Spouse',
    value: 'spouse',
  },
  {
    label: 'Child',
    value: 'child',
  },
]

let name = ''
let location = ''
let relationship = ''
let childBirthYear

const onCancel = event => {
  event.preventDefault()
  dispatch('cancel')
}
const onRemove = event => {
  event.preventDefault()
  dispatch('remove', { uuid })
}
const onSubmit = () => {
  const formData = {
    name,
    location,
    relationship,
  }
  if (relationship === 'child') {
    formData.childBirthYear = childBirthYear
  }
  dispatch('submit', formData)
}
</script>

<style>
.float-left {
  float: left;
}

.float-right {
  float: right;
}

.form-button {
  margin: 0.5rem;
}
</style>

<div class="w-50">
  <Form on:submit={onSubmit}>
    <h4>Dependent</h4>
    <p>
      <TextField label="Dependent Name" bind:value={name} class="w-100" autofocus />
    </p>
    <p>
      Dependents include non-member spouses and children under 26 who haven't
      married or finished college. Coverage for dependents is limited to $3,000
      per person.
    </p>
    <p>
      <TextField label="Location" bind:value={location} class="w-100" />
    </p>
    <p>
      <RadioOptions name="relationship" options={relationshipOptions} bind:value={relationship} />
    </p>
    {#if relationship === 'child'}
      <p>
        <TextField label="Child's birth year" bind:value={childBirthYear} class="w-100" />
      </p>
    {/if}
    <div class="float-right form-button">
      <Button raised>Save</Button>
    </div>
    <div class="float-right form-button">
      <Button on:click={onCancel}>Cancel</Button>
    </div>
    {#if uuid !== undefined}
      <div class="float-left form-button">
        <Button on:click={onRemove} outlined class="mdc-theme--error">Remove</Button>
      </div>
    {/if}
  </Form>
</div>
