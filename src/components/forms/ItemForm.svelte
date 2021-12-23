<script lang="ts">
import user, { User } from '../../authn/user'
import ConvertCurrencyLink from '../ConvertCurrencyLink.svelte'
import Description from '../Description.svelte'
import MakeAndModelModal from 'MakeAndModelModal.svelte'
import ItemDeleteModal from '../ItemDeleteModal.svelte'
import SelectAccountablePerson from '../SelectAccountablePerson.svelte'
import { MAX_INPUT_LENGTH as maxlength, MAX_TEXT_AREA_LENGTH } from 'components/const'
import type { AccountablePersonOptions } from 'data/accountablePersons'
import { ItemCoverageStatus, PolicyItem } from 'data/items'
import { categories, loadCategories, initialized as catItemsInitialized } from 'data/itemCategories'
import { assertHas } from '../../validation/assertions'
import { Button, Form, MoneyInput, Select, TextArea, TextField } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let item = {} as PolicyItem
export let policyId: string

let applyBtnLabel = ''
let formData = {} as any
let open = false
let makeModelIsOpen = false
let selectedAccountablePersonId: string

const dispatch = createEventDispatcher<{ submit: any; 'save-for-later': any; delete: any }>()

// Set default values.
let accountablePersonId = ''
let categoryId = ''
let country = ''
let marketValueUSD = ''
let coverageEndDate = ''
let coverageStartDate = ''
let coverageStatus: ItemCoverageStatus
let itemDescription = ''
let inStorage = false
let make = ''
let model = ''
let riskCategoryId = ''
let name = ''
let uniqueIdentifier = ''

// Set initial values based on the provided item data.
$: setInitialValues($user, item)

let initialCategoryId: string
let today = new Date()

$: country = item?.accountable_person?.country || country
$: !$catItemsInitialized && loadCategories()
$: itemIsDraft = item.coverage_status === ItemCoverageStatus.Draft
$: marketValueIsDisabled = !!item.id && !itemIsDraft
$: applyBtnLabel = !item.coverage_status || itemIsDraft ? 'get approval' : 'save changes'

const onAccountablePersonChange = (event: CustomEvent<AccountablePersonOptions>) => {
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
    coverageEndDate,
    coverageStartDate,
    coverageStatus,
    itemDescription,
    inStorage,
    make,
    model,
    name,
    riskCategoryId,
    uniqueIdentifier,
  }
}

const onAccountablePersonSelectPopulated = () => {
  selectedAccountablePersonId = item.accountable_person?.id || $user.id
}

const onCategorySelectPopulated = () => {
  if (item.category?.id) {
    initialCategoryId = item.category?.id
  }
}

const validateOnSave = (formData: any) => {
  assertHas(formData.accountablePersonId, 'Please Assign an Accountable Person')
  assertHas(formData.categoryId, 'Please select a category')
  assertHas(formData.name, 'Please specify a short name')

  return true
}

const validate = (formData: any) => {
  validateOnSave(formData)
  assertHas(formData.marketValueUSD, 'Please specify the market value')
  assertHas(formData.itemDescription, 'Please add a description')

  return true
}

const areMakeAndModelRequired = () => {
  return (
    item.coverage_status !== ItemCoverageStatus.Approved &&
    $categories.find((category) => category.id === categoryId)?.require_make_model
  )
}

const onSubmit = (event: Event) => {
  formData = getFormData()
  validate(formData)
  if (!(make && model) && areMakeAndModelRequired()) {
    makeModelIsOpen = true
  } else {
    dispatch('submit', formData)
  }
}

const saveForLater = (event: Event) => {
  const formData = getFormData()
  validateOnSave(formData)
  dispatch('save-for-later', formData)
  event.preventDefault()
}

const onDelete = (event: Event) => {
  open = true
  event.preventDefault()
}

const handleDialog = (event: CustomEvent<string>) => {
  open = false
  if (event.detail === 'remove') {
    dispatch('delete')
  }
}

const onMakeModelClosed = (event: CustomEvent<string>) => {
  makeModelIsOpen = false
  event.detail === 'submit' && dispatch('submit', formData)
}

const setInitialValues = (user: User, item: PolicyItem) => {
  accountablePersonId = user.id
  categoryId = item.category?.id || categoryId
  country = item.country || country
  marketValueUSD = Number.isInteger(item.coverage_amount) ? String(item.coverage_amount / 100) : ''
  coverageEndDate = item.coverage_end_date || coverageEndDate
  coverageStartDate = item.coverage_start_date || today.toISOString().slice(0, 10) //api requires yyyy-mm-dd
  coverageStatus = item.coverage_status || coverageStatus
  itemDescription = item.description || itemDescription
  inStorage = typeof item.in_storage === 'boolean' ? item.in_storage : false
  make = item.make || make
  model = item.model || model
  riskCategoryId = item.risk_category?.id || riskCategoryId
  name = item.name || name
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
    <TextField {maxlength} required label="Short name" bind:value={name} />
    <Description>This label will appear on your statements.</Description>
  </p>
  <p>
    <TextArea
      maxlength={MAX_TEXT_AREA_LENGTH}
      required
      label="Item description"
      bind:value={itemDescription}
      rows="4"
    />
    <Description>For personal use.</Description>
  </p>
  <p>
    <TextField {maxlength} label="Unique identifier" bind:value={uniqueIdentifier} />
    <Description>Optional. Serial number, IMEI, service tag, VIN</Description>
  </p>
  <p>
    <TextField {maxlength} label="Make" bind:value={make} />
    <Description>Required for mobile items.</Description>
  </p>
  <p>
    <TextField {maxlength} label="Model" bind:value={model} />
    <Description>Required for mobile items.</Description>
  </p>
  <p>
    <SelectAccountablePerson
      {policyId}
      selectedID={selectedAccountablePersonId}
      on:populated={onAccountablePersonSelectPopulated}
      on:change={onAccountablePersonChange}
    />
    <Description>
      Dependents are eligible. Dependents include spouses and children under 26 who haven't married or finished college.
      Coverage for children is limited to $3,000 per household.
    </Description>
  </p>
  <p>
    <MoneyInput label="Market value (USD)" bind:value={marketValueUSD} disabled={marketValueIsDisabled} required />
    <Description>
      <ConvertCurrencyLink />
    </Description>
  </p>
  <p>
    <Button outlined on:click={saveForLater}>Save for later</Button>
    {#if itemIsDraft}
      <Button outlined on:click={onDelete}>Delete</Button>
      <ItemDeleteModal {open} {item} on:closed={handleDialog} />
    {/if}
    <Button raised>{applyBtnLabel}</Button>
    <MakeAndModelModal open={makeModelIsOpen} on:closed={onMakeModelClosed} />
  </p>
</Form>
