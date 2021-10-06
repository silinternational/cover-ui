<script lang="ts">
import { ConvertCurrencyLink, Description, MoneyInput } from '../../components'
import { AccountablePersonOptions, getDependentOptions, getPolicyMemberOptions } from '../../data/accountablePersons'
import { dependentsByPolicyId } from '../../data/dependents'
import type { ItemCoverageStatus, PolicyItem } from '../../data/items'
import { categories, init, initialized as catItemsInitialized } from '../../data/itemCategories'
import { membersByPolicyId } from '../../data/policy-members'
import { assertHas } from '../../validation/assertions'
import { Button, Form, Select, TextArea, TextField } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let item = {} as PolicyItem
export let policyId: any = undefined

const dispatch = createEventDispatcher<{ submit: any; 'save-for-later': any }>()

// Set default values.
let accountablePersonId: string = ''
let categoryId: string = ''
let country: string = ''
let marketValueUSD: string = ''
let coverageStartDate: string = ''
let coverageStatus: ItemCoverageStatus
let itemDescription: string = ''
let inStorage = false
let make: string = ''
let model: string = ''
let shortName: string = ''
let purchaseDate: string = ''
let uniqueIdentifier: string = ''

// Set initial values based on the provided item data.
$: setInitialValues(item)

let accountablePersons = [] as AccountablePersonOptions[]
let initialAccountablePersonId: any = undefined
let initialCategoryId: any = undefined
let today = new Date()

$: dependents = $dependentsByPolicyId[policyId] || []
$: dependentOptions = getDependentOptions(dependents)

$: policyMembers = $membersByPolicyId[policyId] || []
$: policyMemberOptions = getPolicyMemberOptions(policyMembers)

$: accountablePersons = [...policyMemberOptions, ...dependentOptions]
$: accountablePerson = accountablePersons.find( person => person.id === (accountablePersonId || initialAccountablePersonId)) as AccountablePersonOptions

$: country = accountablePerson?.location || country
$: !$catItemsInitialized && init()

const onAccountablePersonChange = (event: any) => {
  accountablePersonId = event.detail?.id
}

const onSelectCategory = (event: any) => {
  categoryId = event.detail?.id
}

const getFormData = () => {
  return {
    accountablePersonId,
    categoryId,
    country,
    marketValueUSD,
    coverageStartDate,
    coverageStatus,
    itemDescription,
    inStorage,
    make,
    model,
    shortName,
    purchaseDate,
    uniqueIdentifier,
  }
}

const onAccountablePersonSelectPopulated = () => {
  if (item.accountable_user_id) {
    initialAccountablePersonId = item.accountable_user_id
  } else if (item.accountable_dependent_id) {
    initialAccountablePersonId = item.accountable_dependent_id
  }
}

const onCategorySelectPopulated = () => {
  if (item.category?.id) {
    initialCategoryId = item.category?.id
  }
}

const validateOnSave = (formData: any) => {
  assertHas(formData.accountablePersonId, 'Please select an accountable person')
  assertHas(formData.categoryId, 'Please select a category')
  assertHas(formData.shortName, 'Please specify a short name')

  return true
}

const validate = (formData: any) => {
  validateOnSave(formData)
  assertHas(formData.marketValueUSD, 'Please specify the market value')
  assertHas(formData.itemDescription, 'Please add a description')
  assertHas(formData.uniqueIdentifier, 'Please specify a unique identifier')

  return true
}

const onSubmit = (event: Event) => {
  const formData = getFormData()
  validate(formData) //TODO open a scare dialog for make and model on certain categories
  dispatch('submit', formData)
}

const saveForLater = (event: Event) => {
  const formData = getFormData()
  validateOnSave(formData)
  dispatch('save-for-later', formData)
  event.preventDefault()
}

const setInitialValues = (item: PolicyItem) => {
  categoryId = item.category?.id || categoryId
  country = item.country || country
  marketValueUSD = Number.isInteger(item.coverage_amount) ? String(item.coverage_amount / 100) : ''
  coverageStartDate = item.coverage_start_date || today.toISOString().slice(0, 10) //api requires yyyy-mm-dd
  coverageStatus = item.coverage_status || coverageStatus
  itemDescription = item.description || itemDescription
  inStorage = typeof item.in_storage === 'boolean' ? item.in_storage : false
  make = item.make || make
  model = item.model || model
  shortName = item.name || shortName
  purchaseDate = item.purchase_date || coverageStartDate
  uniqueIdentifier = item.serial_number || uniqueIdentifier
}
</script>

<Form on:submit={onSubmit}>
  <p>
    <Select
      label="Category"
      options={$categories}
      selectedID={initialCategoryId}
      on:change={onSelectCategory}
      on:populated={onCategorySelectPopulated}
    />
  </p>
  <p>
    <TextField label="Short name" bind:value={shortName} />
    <Description>This label will appear on your statements.</Description>
  </p>
  <p>
    <TextArea label="Item description" bind:value={itemDescription} rows="4" />
    <Description>For personal use.</Description>
  </p>
  <p>
    <TextField label="Unique identifier" bind:value={uniqueIdentifier} />
    <Description>Optional. Serial number, IMEI, service tag, VIN</Description>
  </p>
  <p>
    <TextField label="Make" bind:value={make} />
    <Description>Required for mobile items.</Description>
  </p>
  <p>
    <TextField label="Model" bind:value={model} />
    <Description>Required for mobile items.</Description>
  </p>
  <p>
    <Select
      label="Accountable person"
      on:change={onAccountablePersonChange}
      on:populated={onAccountablePersonSelectPopulated}
      options={accountablePersons}
      selectedID={initialAccountablePersonId}
    />
    <Description>
      Dependents are eligible. Dependents include spouses and children under 26 who haven't married or finished college.
      Coverage for children is limited to $3,000 per household.
    </Description>
  </p>
  <p>
    <MoneyInput label="Market value (USD)" bind:value={marketValueUSD} />
    <Description>
      <ConvertCurrencyLink />
    </Description>
  </p>
  <p>
    <Button outlined on:click={saveForLater}>Save for later</Button>
    <Button raised>Get approval</Button>
  </p>
</Form>
