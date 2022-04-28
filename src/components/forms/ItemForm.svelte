<script lang="ts">
import user, { isAdmin, User } from 'data/user'
import ConvertCurrencyLink from '../ConvertCurrencyLink.svelte'
import Description from '../Description.svelte'
import MakeAndModelModal from 'MakeAndModelModal.svelte'
import ItemDeleteModal from '../ItemDeleteModal.svelte'
import SelectAccountablePerson from '../SelectAccountablePerson.svelte'
import { MAX_TEXT_AREA_LENGTH } from 'components/const'
import type { AccountablePersonOptions } from 'data/accountablePersons'
import { ItemCoverageStatus, PolicyItem } from 'data/items'
import { categories, loadCategories, initialized as catItemsInitialized } from 'data/itemCategories'
import TextFieldWithLabel from '../TextFieldWithLabel.svelte'
import { assertHas, assertIsLessOrEqual } from '../../validation/assertions'
import { debounce } from 'lodash-es'
import { Button, Form, MoneyInput, Select, TextArea } from '@silintl/ui-components'
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
$: marketValueIsDisabled = !!item.id && !itemIsDraft && !isAdmin
$: applyBtnLabel = !item.coverage_status || itemIsDraft ? 'review and checkout' : 'save changes'
$: make,
  model,
  itemDescription,
  uniqueIdentifier,
  marketValueUSD,
  accountablePersonId && categoryId && name && debouncedSave()

const debouncedSave = debounce(() => saveForLater(undefined, true), 4000)

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
  assertIsLessOrEqual(formData.marketValueUSD * 100, item.coverage_amount, 'Coverage amount cannot be increased')
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

const saveForLater = (event?: Event, isAutoSaving = false) => {
  const formData = getFormData()
  validateOnSave(formData)
  dispatch('save-for-later', { ...formData, isAutoSaving })
  event?.preventDefault()
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
  accountablePersonId = item.accountable_person?.id || user.id
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

<style>
.label {
  display: block;
  margin-bottom: 0.5rem;
}
</style>

<Form on:submit={onSubmit}>
  <p>
    <span class="label">
      Category<span class="error">*</span>
    </span>
    <Select
      label="Input"
      options={$categories}
      selectedID={initialCategoryId}
      on:change={onSelectCategory}
      on:populated={onCategorySelectPopulated}
    />
  </p>
  <p>
    <TextFieldWithLabel label="Brand" description={'For example, "Apple"'} bind:value={make} />
  </p>
  <p>
    <TextFieldWithLabel label="Model" description="For example, “iPhone 10 Max 64 GB” or “A1921”" bind:value={model} />
  </p>
  <p>
    <TextFieldWithLabel
      label="Unique identifier"
      description="Optional. Serial number, IMEI, service tag, VIN"
      bind:value={uniqueIdentifier}
    />
  </p>
  <p>
    <TextFieldWithLabel
      label="Short name"
      description="This label will appear on your statements."
      required
      bind:value={name}
    />
  </p>
  <p>
    <span class="label">Notes</span>
    <TextArea maxlength={MAX_TEXT_AREA_LENGTH} description="For your own use" bind:value={itemDescription} rows="4" />
  </p>
  <p>
    <span class="label">Accountable Person<span class="error">*</span></span>
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
    <span class="label">Value to cover (USD)<span class="error">*</span></span>
    <MoneyInput minValue={'0'} bind:value={marketValueUSD} disabled={marketValueIsDisabled} required />
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
