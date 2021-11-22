<script lang="ts">
import RadioOptions from '../RadioOptions.svelte'
import SearchableSelect from '../components/SearchableSelect.svelte'
import { countries, Country } from 'data/countries'
import type { PolicyDependent } from 'data/dependents'
import { assertHas, assertIsLessThan, assertUnique } from '../../validation/assertions'
import { Button, Form, setNotice, TextField } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let dependent: PolicyDependent = {}
export let dependents: PolicyDependent[] = []
export let isHouseholdPolicy = true

let countryOptions: any = {}

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
  country: dependent.country || '',
  relationship: dependent.relationship || '',
  childBirthYear: dependent.child_birth_year || undefined,
}

$: alreadyHasSpouse = !!dependents
  .filter((dep) => dep.id !== dependent.id)
  .find((dependent) => dependent.relationship === 'Spouse')

$: alreadyHasSpouse && (relationshipOptions[0].disabled = true)
$: alreadyHasSpouse && isHouseholdPolicy && (formData.relationship = 'Child')

$: $countries.forEach((country: Country) => (countryOptions[country.name] = country.name))

const validate = (isChild: boolean) => {
  assertHas(formData.name, 'Please specify a name')
  assertUnique(
    formData.name,
    dependents.filter((d) => d.id !== formData.id).map((d) => d.name),
    'Dependent must have unique name'
  )
  assertHas(formData.country, 'Please specify a country')
  if (isHouseholdPolicy) {
    assertHas(formData.relationship, 'Please select "Spouse" or "Child"')
    isChild && assertHas(formData.childBirthYear, "Please specify your child's birthyear")
    const year = new Date().getFullYear()
    isChild && assertIsLessThan(formData.childBirthYear, year + 1, `Birthyear should be ${year} or earlier`)
  }
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
  if (isHouseholdPolicy) {
    const isChild: boolean = formData.relationship === 'Child'
    validate(isChild)
    if (!isChild) {
      delete formData.childBirthYear
    }
  } else {
    delete formData.relationship
    delete formData.childBirthYear
    validate(false)
  }
  dispatch('submit', formData)
}

const isCountryValid = (countryName: string) => $countries.some((country) => country.name === countryName)

const updateCountry = (event: CustomEvent) => {
  if (isCountryValid(event.detail)) {
    formData.country = event.detail
  } else {
    setNotice('Please select a country from the list')
  }
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

<div class={$$props.class}>
  <Form on:submit={onSubmit}>
    <h4>Dependent</h4>
    <p>
      <TextField label="Dependent Name" bind:value={formData.name} class="w-100" autofocus />
    </p>
    {#if isHouseholdPolicy}
      <p>
        Dependents include non-member spouses and children under 26 who haven't married or finished college. Coverage
        for dependents is limited to $3,000 per person.
      </p>
    {/if}
    <p>
      <span class="header">Dependent Location<span class="required">*</span></span>
      <SearchableSelect
        choice={formData.country}
        options={countryOptions}
        placeholder="Enter country"
        on:check={updateCountry}
      />
    </p>
    {#if isHouseholdPolicy}
      <p>
        <RadioOptions name="relationship" options={relationshipOptions} bind:value={formData.relationship} />
      </p>
      {#if formData.relationship === 'Child'}
        <p>
          <TextField label="Child's birth year" bind:value={formData.childBirthYear} class="w-100" />
        </p>
      {/if}
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
