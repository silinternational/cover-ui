<script lang="ts">
import ConvertCurrencyLink from '../ConvertCurrencyLink.svelte'
import Description from '../Description.svelte'
import MakeAndModelModal from '../MakeAndModelModal.svelte'
import ItemDeleteModal from '../ItemDeleteModal.svelte'
import { MAX_TEXT_AREA_LENGTH } from 'components/const'
import type { AccountablePersonOptions } from 'data/accountablePersons'
import { ItemCoverageStatus, NewItemFormData, PolicyItem, RiskCategoryNames, UpdateItemFormData } from 'data/items'
import { categories, loadCategories, initialized as catItemsInitialized } from 'data/itemCategories'
import user, { isAdmin, User } from 'data/user'
import { areMakeAndModelRequired, assembleShortNameExample, validateForSubmit, validateForSave } from './items/itemFormHelpers'
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
let marketValueUSD: number | string | undefined
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
let shortNameExample = ''
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
$: selectedCategory = $categories.find((c) => c.id === categoryId)
$: selectedCategoryIsStationary = selectedCategory?.risk_category?.name === RiskCategoryNames.Stationary
$: shortNameExample = assembleShortNameExample(make, model)

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

const onSubmit = () => {
  formData = getFormData()
  validateForSubmit(item, formData)
  if (!(make && model) && areMakeAndModelRequired(item, categoryId)) {
    makeModelIsOpen = true
  } else {
    dispatch('submit', formData)
  }
}

const saveForLater = (event?: Event, isAutoSaving = false) => {
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
  event.detail === 'submit' && dispatch('submit', formData)
}

const setInitialValues = (user: User, item: PolicyItem) => {
  accountablePersonId = item.accountable_person?.id || user.id
  categoryId = item.category?.id || categoryId
  country = item.country || country
  marketValueUSD = Number.isInteger(item.coverage_amount) ? String(item.coverage_amount / 100) : undefined
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
span.label {
  display: block;
  margin-bottom: 0.5rem;
}

.material-icons {
  padding-right: 0.5rem;
  color: var(--mdc-theme-status-info);
}

.category-info {
  color: var(--mdc-theme-status-info);
}
</style>

<Form on:submit={onSubmit}>
  <h2>About the item</h2>
  <p>
    <Select
      width="360px"
      label="Category"
      options={$categories}
      selectedID={initialCategoryId}
      on:change={onSelectCategory}
      on:populated={onCategorySelectPopulated}
    />
    {#if selectedCategoryIsStationary}
      <Card class="w-360px mt-1" color="var(--mdc-theme-status-info-bg)">
        <div class="flex justify-start">
          <div class="material-icons">info</div>
          <div class="category-info">
            Coverage for home electronics and appliances is intended for locations that lack access to homeowner’s or
            renter’s insurance.
          </div>
        </div>
      </Card>
    {/if}
  </p>
  <p>
    <TextField
      label="Brand (optional)"
      class="mw-300"
      description="e.g., Apple or Toyota"
      bind:value={make}
    />
  </p>
  <p>
    <TextField
      label="Model (optional)"
      class="mw-300"
      description="e.g., iPhone 10 Max 64 GB, A1921, or Land Cruiser"
      bind:value={model}
    />
  </p>
  <p>
    <TextField
      label="Serial number (optional for fast approval)"
      class="mw-300"
      description="e.g., chassis number, VIN, IMEI, or service tag"
      bind:value={uniqueIdentifier}
    />
  </p>
  <h2>Coverage</h2>
  <p>
    <SelectAccountablePerson
      {policyId}
      selectedID={selectedAccountablePersonId}
      on:populated={onAccountablePersonSelectPopulated}
      on:change={onAccountablePersonChange}
    />
  </p>
  <p>
    <MoneyInput
      label="Coverage value (USD)"
      bind:value={marketValueUSD}
      disabled={marketValueIsDisabled}
    />
    <Description>
      <ConvertCurrencyLink />
    </Description>
  </p>
  <h2>For your own use</h2>
  <p>
    <TextField
      label="Statement name"
      class="mw-300"
      description={'Customize what will appear on your financial statements.' + (shortNameExample ? ` Example: ${shortNameExample}` : '')}
      bind:value={name}
    />
  </p>
  <p>
    <TextArea
      label="Notes (optional)"
      maxlength={MAX_TEXT_AREA_LENGTH}
      bind:value={itemDescription}
      rows="4"
    />
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
