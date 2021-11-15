<script lang="ts">
import RadioOptions from '../RadioOptions.svelte'
import { assertHas } from '../../validation/assertions'
import type { PolicyDependent } from 'data/dependents'
import { Button, Form, TextField } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let dependent: PolicyDependent = {}
export let dependents: PolicyDependent[] = []
export let isHouseholdPolicy = true

const dispatch = createEventDispatcher<{ cancel: void; remove: string; submit: PolicyDependent }>()
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

$: alreadyHasSpouse = !!dependents
  .filter((dep) => dep.id !== dependent.id)
  .find((dependent) => dependent.relationship === 'Spouse')

$: alreadyHasSpouse && (relationshipOptions[0].disabled = true)

const validate = (isChild: boolean) => {
  assertHas(dependent?.name, 'Please specify a name')
  assertHas(dependent?.country, 'Please specify a country')
  if (isHouseholdPolicy) {
    assertHas(dependent?.relationship, 'Please select "Spouse" or "Child"')
    isChild && assertHas(dependent?.child_birth_year, "Please specify your child's birthyear")
  }
}

const onCancel = (event: Event) => {
  event.preventDefault()
  dispatch('cancel')
}

const onRemove = (event: Event) => {
  event.preventDefault()
  dispatch('remove', dependent.id)
}

const onSubmit = () => {
  if (isHouseholdPolicy) {
    const isChild: boolean = dependent.relationship === 'Child'
    validate(isChild)
    if (!isChild) {
      dependent.child_birth_year = 0
    }
  } else {
    dependent.relationship = 'None'
    dependent.child_birth_year = 0
    validate(false)
  }

  dependent.child_birth_year = Number(dependent.child_birth_year) // TODO: add a numeric based TextField
  dispatch('submit', dependent)
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
      <TextField label="Dependent Name" bind:value={dependent.name} class="w-100" autofocus />
    </p>
    {#if isHouseholdPolicy}
      <p>
        Dependents include non-member spouses and children under 26 who haven't married or finished college. Coverage
        for dependents is limited to $3,000 per person.
      </p>
    {/if}
    <p>
      <TextField label="Country" bind:value={dependent.country} class="w-100" />
    </p>
    {#if isHouseholdPolicy}
      <p>
        <RadioOptions name="relationship" options={relationshipOptions} bind:value={dependent.relationship} />
      </p>
      {#if dependent?.relationship === 'Child'}
        <p>
          <TextField label="Child's birth year" bind:value={dependent.child_birth_year} class="w-100" />
        </p>
      {/if}
    {/if}
    <div class="float-right form-button">
      <Button raised>Save</Button>
    </div>
    <div class="float-right form-button">
      <Button on:click={onCancel}>Cancel</Button>
    </div>
    {#if dependent?.id !== undefined}
      <div class="float-left form-button">
        <Button on:click={onRemove} outlined class="mdc-theme--error">Remove</Button>
      </div>
    {/if}
  </Form>
</div>
