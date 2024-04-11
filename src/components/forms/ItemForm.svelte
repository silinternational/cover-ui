<script lang="ts">
import ConvertCurrencyLink from '../ConvertCurrencyLink.svelte'
import Description from '../Description.svelte'
import MakeAndModelModal from '../MakeAndModelModal.svelte'
import ItemDeleteModal from '../ItemDeleteModal.svelte'
import YearInput from '../YearInput.svelte'
import { MAX_TEXT_AREA_LENGTH } from 'components/const'
import type { AccountablePersonOptions } from 'data/accountablePersons'
import {
  itemIsDraft,
  ItemCoverageStatus,
  NewItemFormData,
  PolicyItem,
  RiskCategoryNames,
  UpdateItemFormData,
} from 'data/items'
import { categories, loadCategories, initialized as catItemsInitialized } from 'data/itemCategories'
import user, { isAdmin, User } from 'data/user'
import {
  areMakeAndModelRequired,
  assembleStatementNameDefault,
  validateForSubmit,
  validateForSave,
} from './items/itemFormHelpers'
import SelectAccountablePerson from '../SelectAccountablePerson.svelte'
import { debounce } from 'lodash-es'
import { Button, Card, Form, MoneyInput, Select, TextArea, TextField } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let item = {} as PolicyItem
export let policyId: string

let applyBtnLabel = ''
let formData = {} as NewItemFormData
let open = false
let makeModelIsOpen = false
let selectedAccountablePersonId: string

const dispatch = createEventDispatcher<{
  submit: NewItemFormData | UpdateItemFormData
  'save-for-later': UpdateItemFormData
  delete: any
}>()

// Set default values.
let accountablePersonId = ''
let categoryId = ''
let country = ''
let coverageAmountUSD: number | string | undefined
let coverageStatus: ItemCoverageStatus
let itemDescription = ''
let inStorage = false
let make = ''
let model = ''
let riskCategoryId = ''
let name = ''
let uniqueIdentifier = ''
let year: number | undefined

let hasModelWarn = false
let hasMakeWarn = false
let hasSerialWarn = false
let hasNameError = false
// let hasAccountableError = false
// let hasCategoryError = false
let hasValueError = false
let hasYearError = false
let isSavingForLater = false

// Set initial values based on the provided item data.
$: setInitialValues($user, item)

let initialCategoryId: string
let statementNameDefault = ''
let userCustomizedStatementName = false

$: country = item?.accountable_person?.country || country
$: !$catItemsInitialized && loadCategories()
$: isDraft = itemIsDraft(item)
$: coverageAmountIsDisabled = !!item.id && !isDraft && !isAdmin
$: applyBtnLabel = !item.coverage_status || isDraft ? 'review and checkout' : 'save changes'
$: make,
  model,
  itemDescription,
  uniqueIdentifier,
  coverageAmountUSD,
  year,
  accountablePersonId && categoryId && name && debouncedSave()
$: selectedCategory = $categories.find((c) => c.id === categoryId)
$: selectedCategoryIsStationary = selectedCategory?.risk_category?.name === RiskCategoryNames.Stationary
$: selectedCategoryIsVehicle = selectedCategory?.risk_category?.name === RiskCategoryNames.Vehicle
$: statementNameDefault = assembleStatementNameDefault(make, model, year, uniqueIdentifier)
$: !userCustomizedStatementName && (name = statementNameDefault)

const debouncedSave = debounce(() => saveForLater(undefined, true), 4000)

const onAccountablePersonChange = (event: CustomEvent<AccountablePersonOptions>) => {
  accountablePersonId = event.detail?.id
}

const onSelectCategory = (event: any) => {
  categoryId = event.detail?.id
}

const getFormData = (): NewItemFormData => {
  return {
    accountablePersonId,
    categoryId,
    country,
    coverageAmountUSD,
    coverageStatus,
    itemDescription,
    inStorage,
    make,
    model,
    name,
    riskCategoryId,
    uniqueIdentifier,
    year,
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

const onSubmit = () => {
  formData = getFormData()
  validateForSubmit(item, formData, selectedCategoryIsVehicle)
  if (!(make && model) && areMakeAndModelRequired(item, categoryId)) {
    makeModelIsOpen = true
  } else {
    dispatch('submit', formData)
  }
}

const saveForLater = (event?: Event, isAutoSaving = false) => {
  isSavingForLater = true
  const formData = getFormData()
  validateForSave(formData)
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
  hasMakeWarn = !make
  hasModelWarn = !model
  event.detail === 'submit' && dispatch('submit', formData)
}

const onStatementNameInput = (event: InputEvent) => {
  const inputElement = event.target as HTMLInputElement
  userCustomizedStatementName = inputElement.value !== ''
}

const setInitialValues = (user: User, item: PolicyItem) => {
  accountablePersonId = item.accountable_person?.id || user.id
  categoryId = item.category?.id || categoryId
  country = item.country || country
  coverageAmountUSD = Number.isInteger(item.coverage_amount) ? String(item.coverage_amount / 100) : undefined
  coverageStatus = item.coverage_status || coverageStatus
  itemDescription = item.description || itemDescription
  inStorage = typeof item.in_storage === 'boolean' ? item.in_storage : false
  make = item.make || make
  model = item.model || model
  riskCategoryId = item.risk_category?.id || riskCategoryId
  name = item.name || name
  uniqueIdentifier = item.serial_number || uniqueIdentifier
  year = item.year || year

  const defaultName = assembleStatementNameDefault(make, model, year, uniqueIdentifier)
  if (name && name !== defaultName) {
    userCustomizedStatementName = true
  }
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    beforeSubmit()
  }
}

const onSubmitClick = () => beforeSubmit()

const beforeSubmit = () => {
  hasNameError = !name
  // hasAccountableError = !accountablePersonId)
  //hasCategoryError = !categoryId)
  hasValueError = !coverageAmountUSD
  if (selectedCategoryIsVehicle) {
    hasMakeWarn = !make
    hasModelWarn = !model
    hasSerialWarn = !uniqueIdentifier
  }
}
</script>

<style>
.side-by-side > * {
  display: inline-block;
  margin-right: 1rem;
}
</style>

<Form on:submit={onSubmit}>
  <h2>About the item</h2>
  <div class="tw-w-80 tw-max-w-full">
    <Select
      width="100%"
      label="Category"
      options={$categories}
      selectedID={initialCategoryId}
      on:change={onSelectCategory}
      on:populated={onCategorySelectPopulated}
    />
    {#if selectedCategoryIsStationary}
      <Card class="mt-1 tw-w-full" color="var(--mdc-theme-status-info-bg)">
        <div class="flex justify-start tw-gap-2">
          <div class="material-icons tw-text-[var(--mdc-theme-status-info)]">info</div>
          <div class="tw-text-[var(--mdc-theme-status-info)]">
            Coverage for home electronics and appliances is intended for locations that lack access to homeowner’s or
            renter’s insurance.
          </div>
        </div>
      </Card>
    {/if}
  </div>
  <div>
    <TextField
      showWarn={hasMakeWarn}
      label="Brand (optional)"
      class="tw-w-80 tw-max-w-full"
      description="e.g., Apple or Toyota"
      bind:value={make}
    />
  </div>
  <div class:side-by-side={selectedCategoryIsVehicle}>
    <div>
      <TextField
        showWarn={hasModelWarn}
        label="Model (optional)"
        class="tw-w-80 tw-max-w-full"
        description="e.g., iPhone 10 Max 64 GB, A1921, or Land Cruiser"
        bind:value={model}
      />
    </div>
    {#if selectedCategoryIsVehicle}
      <div>
        <YearInput showError={hasYearError} required label="Year" minValue={1900} bind:value={year} />
      </div>
    {/if}
  </div>
  <div>
    <TextField
      showWarn={hasModelWarn}
      label="Serial number (optional for fast approval)"
      class="tw-w-80 tw-max-w-full"
      description="e.g., chassis number, VIN, IMEI, or service tag"
      bind:value={uniqueIdentifier}
    />
  </div>
  <h2>Coverage</h2>
  <div class="tw-w-80 tw-max-w-full">
    <SelectAccountablePerson
      {policyId}
      selectedID={selectedAccountablePersonId}
      on:populated={onAccountablePersonSelectPopulated}
      on:change={onAccountablePersonChange}
    />
  </div>
  <div>
    <MoneyInput
      required={!isSavingForLater}
      showError={hasValueError}
      label="Coverage value (USD)"
      bind:value={coverageAmountUSD}
      disabled={coverageAmountIsDisabled}
    />
    <Description>
      <ConvertCurrencyLink />
    </Description>
  </div>
  <h2>For your own use</h2>
  <div>
    <TextField
      required
      showError={hasNameError}
      label="Statement name"
      class="tw-w-80 tw-max-w-full"
      description="Customize what will appear on your financial statements"
      bind:value={name}
      on:input={onStatementNameInput}
    />
  </div>
  <div class="tw-max-w-prose">
    <TextArea label="Notes (optional)" maxlength={MAX_TEXT_AREA_LENGTH} bind:value={itemDescription} rows="4" />
  </div>
  <p>
    <Button outlined on:click={saveForLater}>Save for later</Button>
    {#if isDraft}
      <Button outlined on:click={onDelete}>Delete</Button>
      <ItemDeleteModal {open} {item} on:closed={handleDialog} />
    {/if}
    <Button on:click={onSubmitClick} on:keydown={onKeydown} raised>{applyBtnLabel}</Button>
    <MakeAndModelModal open={makeModelIsOpen} on:closed={onMakeModelClosed} />
  </p>
</Form>
