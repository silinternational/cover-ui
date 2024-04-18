<script context="module" lang="ts">
export type DependentFormData = {
  id: string
  name: string
  country: string
  relationship?: string
  childBirthYear?: number
  permissions: 'no-login' | 'can-edit'
  email: string
  message: string
}
</script>

<script lang="ts">
import { MAX_INPUT_LENGTH as maxlength, MAX_TEXT_AREA_LENGTH } from 'components/const'
import CountrySelector from '../CountrySelector.svelte'
import type { PolicyDependent } from 'data/dependents'
import { ITEMS } from 'helpers/routes'
import RadioOptions from '../RadioOptions.svelte'
import RemoveDependentModal from '../RemoveDependentModal.svelte'
import { assertEmailAddress, assertHas, assertIsLessThan, assertUnique } from '../../validation/assertions'
import YearInput from '../YearInput.svelte'
import { Button, Form, TextArea, TextField } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'
import { goto } from '@roxi/routify'

export let dependent = {} as PolicyDependent
export let dependents: PolicyDependent[] = []
export let isHouseholdPolicy = true
export let policyId: string = ''

let teamOrHousehold: string = isHouseholdPolicy ? 'household' : 'team'
let removeModalIsOpen: boolean = false
let formData: DependentFormData = {
  id: dependent.id,
  name: dependent.name || '',
  country: dependent.country || '',
  relationship: dependent.relationship || '',
  childBirthYear: dependent.child_birth_year || undefined,
  permissions: 'no-login',
  email: '',
  message: '',
}
let showRelativeError = false
let showBirthYearError = false

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
const permissionOptions = [
  {
    label: 'No login',
    value: 'no-login',
    disabled: false,
  },
  {
    label: `Can edit items and claims for ${teamOrHousehold}`,
    value: 'can-edit',
    disabled: false,
  },
]

$: alreadyHasSpouse = !!dependents
  .filter((dep) => dep.id !== dependent.id)
  .find((dependent) => dependent.relationship === 'Spouse')

$: alreadyHasSpouse && (relationshipOptions[0].disabled = true)
$: alreadyHasSpouse && isHouseholdPolicy && (formData.relationship = 'Child')
$: if (formData.relationship === 'Child') {
  formData.permissions = 'no-login'
  permissionOptions[0].disabled = true
  permissionOptions[1].disabled = true
} else {
  permissionOptions[0].disabled = false
  permissionOptions[1].disabled = false
}

const dispatch = createEventDispatcher()

const validate = (isChild: boolean) => {
  assertHas(formData.name, 'Please specify a name')
  assertUnique(
    formData.name,
    dependents.filter((d) => d.id !== formData.id).map((d) => d.name),
    `${isHouseholdPolicy ? 'Dependent' : 'Person'} must have unique name`
  )
  assertHas(formData.country, 'Please specify a country')
  if (isHouseholdPolicy) {
    assertHas(formData.relationship, 'Please select "Spouse" or "Child"')
    isChild && assertHas(formData.childBirthYear, "Please specify your child's birthyear")
    const year = new Date().getFullYear()
    isChild && assertIsLessThan(formData.childBirthYear, year + 1, `Birthyear should be ${year} or earlier`)
  }
  if (formData.permissions === 'can-edit') {
    assertEmailAddress(formData.email, 'Please enter a valid email address')
    assertHas(formData.message, 'Please supply a personalized message')
  }
}
const onCancel = (event: Event) => {
  event.preventDefault()
  dispatch('cancel')
}
const onClickRemove = (event: Event) => {
  event.preventDefault()
  removeModalIsOpen = true
}

const onRemove = async (e: CustomEvent) => {
  const personIdToAssign = e.detail

  dispatch('remove', { personIdToRemove: formData.id, personIdToAssign })
  removeModalIsOpen = false
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

const setErrors = () => {
  showRelativeError = isHouseholdPolicy && !formData.relationship
  showBirthYearError = isHouseholdPolicy && formData.relationship === 'Child' && !formData.childBirthYear
}

const onChosen = (event: CustomEvent) => (formData.country = event.detail)
</script>

<div class={$$props.class}>
  <Form on:submit={onSubmit}>
    <p>
      <TextField required {maxlength} label="Person's Name" bind:value={formData.name} class="w-100" autofocus />
    </p>
    {#if isHouseholdPolicy}
      <p>
        Dependents include non-member spouses and children under 26 who haven't married or finished college. Coverage
        for dependents is limited to $3,000 per person.
      </p>
    {/if}
    <p>
      <span class="header">Primary Location<span class="required-input">*</span></span>
      <CountrySelector required country={formData.country} on:chosen={onChosen} />
    </p>
    {#if isHouseholdPolicy}
      <p>
        <label class="mdc-bold-font" for="relationship">Relationship</label>
        <RadioOptions
          name="relationship"
          required
          showError={showRelativeError}
          options={relationshipOptions}
          bind:value={formData.relationship}
          on:change={() => (showRelativeError = false)}
        />
      </p>
      {#if formData.relationship === 'Child'}
        <p>
          <YearInput
            showError={showBirthYearError}
            required
            {maxlength}
            label="Child's birth year"
            bind:value={formData.childBirthYear}
            class="w-100"
            on:blur={() => (showBirthYearError = false)}
          />
        </p>
      {/if}
    {/if}
    <p>
      <label class="mdc-bold-font" for="permissions">Permissions</label>
      <RadioOptions name="permissions" options={permissionOptions} bind:value={formData.permissions} />
    </p>
    {#if formData.permissions === 'can-edit'}
      <p>
        <TextField {maxlength} label="Email" bind:value={formData.email} class="w-100" />
      </p>
      <p>
        <TextArea
          maxlength={MAX_TEXT_AREA_LENGTH}
          class="w-100"
          rows="4"
          placeholder="A personalized message for the person you are inviting"
          bind:value={formData.message}
        />
      </p>
    {/if}

    <div class="tw-float-right tw-m-2">
      <Button on:click={setErrors} raised>{formData.permissions === 'no-login' ? 'Save' : 'Invite Person'}</Button>
    </div>
    <div class="tw-float-right tw-m-2">
      <Button on:click={onCancel}>Cancel</Button>
    </div>
    {#if formData.id !== undefined}
      <div class="tw-float-left tw-m-2">
        <Button on:click={onClickRemove} outlined class="mdc-theme--error">Remove</Button>
      </div>
    {/if}
  </Form>

  <RemoveDependentModal
    {dependent}
    {policyId}
    open={removeModalIsOpen}
    on:remove={onRemove}
    on:gotoItems={() => $goto(ITEMS)}
    on:cancel={() => (removeModalIsOpen = false)}
    on:closed={() => (removeModalIsOpen = false)}
  />
</div>
