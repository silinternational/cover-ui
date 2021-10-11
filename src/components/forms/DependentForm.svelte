<script lang="ts">
import RadioOptions from '../RadioOptions.svelte'
import { assertHas } from '../../validation/assertions'
import type { PolicyDependent } from 'data/dependents'
import { Button, Form, TextField } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let dependent: PolicyDependent = {}
export let dependents: PolicyDependent[] = []

const dispatch = createEventDispatcher()
const relationshipOptions = [
  {
    label: 'Spouse',
    value: 'Spouse',
    disabled: false,
  },
  {
    label: 'Child',
    value: 'Child',
    disabled: false,
  },
]

let formData = {
  id: dependent.id,
  name: dependent.name || '',
  location: dependent.location || '',
  relationship: dependent.relationship || '',
  childBirthYear: dependent.child_birth_year || undefined,
}

$: alreadyHasSpouse = !!dependents
  .filter((dep) => dep.id !== dependent.id)
  .find((dependent) => dependent.relationship === 'Spouse')

$: alreadyHasSpouse && (relationshipOptions[0].disabled = true)

const validate = (isChild: boolean): boolean | void => {
  assertHas(formData.name, 'Please specify a name')
  assertHas(formData.location, 'Please specify a location')
  assertHas(formData.relationship, 'Please select "Spouse" or "Child"')
  isChild && assertHas(formData.childBirthYear, "Please specify your child's birthyear")
  return true
}
const onCancel = (event: Event) => {
  event.preventDefault()
  dispatch('cancel')
}
const onRemove = (event: Event) => {
  event.preventDefault()
  dispatch('remove', formData.id)
}
const onSubmit = () => {
  const isChild: boolean = formData.relationship === 'Child'
  validate(isChild)
  if (!isChild) {
    delete formData.childBirthYear
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
      <TextField label="Dependent Name" bind:value={formData.name} class="w-100" autofocus />
    </p>
    <p>
      Dependents include non-member spouses and children under 26 who haven't married or finished college. Coverage for
      dependents is limited to $3,000 per person.
    </p>
    <p>
      <TextField label="Location" bind:value={formData.location} class="w-100" />
    </p>
    <p>
      <RadioOptions name="relationship" options={relationshipOptions} bind:value={formData.relationship} />
    </p>
    {#if formData.relationship === 'Child'}
      <p>
        <TextField label="Child's birth year" bind:value={formData.childBirthYear} class="w-100" />
      </p>
    {/if}
    <div class="float-right form-button">
      <Button raised>Save</Button>
    </div>
    <div class="float-right form-button">
      <Button on:click={onCancel}>Cancel</Button>
    </div>
    {#if formData.id !== undefined}
      <div class="float-left form-button">
        <Button on:click={onRemove} outlined class="mdc-theme--error">Remove</Button>
      </div>
    {/if}
  </Form>
</div>
