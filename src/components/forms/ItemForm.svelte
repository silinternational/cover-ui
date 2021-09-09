<script>
import { ConvertCurrencyLink, Description, MoneyInput } from '../../components'
import { dependentsByPolicyId, loadDependents } from '../../data/dependents.js'
import { categories, init, initialized as catItemsInitialized } from '../../data/itemCategories'
import { loadMembersOfPolicy, membersByPolicyId } from '../../data/policy-members'
import { Button, Form, Select, TextArea, TextField } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let item = {}
export let policyId = undefined

const dispatch = createEventDispatcher()

// Set default values.
let accountablePersonId = ''
let categoryId = ''
let country = ''
let marketValueUSD = ''
let coverageStartDate = ''
let coverageStatus = 'Draft'
let itemDescription = ''
let inStorage = false
let make = ''
let model = ''
let shortName = ''
let purchaseDate = ''
let uniqueIdentifier = ''

// Set initial values based on the provided item data.
$: setInitialValues(item)

let initialCategoryId = undefined
let today = new Date()

$: dependents = $dependentsByPolicyId[policyId] || []
$: dependentOptions = dependents.map(dependent => ({
  id: dependent.id,
  name: dependent.name
}))

$: policyMembers = $membersByPolicyId[policyId] || []
$: policyMemberOptions = policyMembers.map(policyMember => ({
  id: policyMember.id,
  name: policyMember.first_name + ' ' + policyMember.last_name
}))

$: accountablePersons = [...policyMemberOptions, ...dependentOptions]

$: policyId && loadDependents(policyId)
$: policyId && loadMembersOfPolicy(policyId)
$: !$catItemsInitialized && init()

const onAccountablePersonChange = event => {
  accountablePersonId = event.detail?.id
}

const onSelectCategory = event => {
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
const onCategorySelectPopulated = () => {
  if (item.category?.id) {
    initialCategoryId = item.category?.id
  }
}
const onSubmit = () => {
  dispatch('submit', getFormData())
}
const saveForLater = () => {
  dispatch('save-for-later', getFormData())
}
const setInitialValues = (item) => {
  categoryId = item.category?.id || categoryId
  country = item.country || country
  if (Number.isInteger(item.coverage_amount)) {
    marketValueUSD = item.coverage_amount / 100
  }
  if (item.coverage_start_date) {
    coverageStartDate = item.coverage_start_date
  } else {
    coverageStartDate = today.toISOString().slice(0, 10) //api requires yyyy-mm-dd
  }
  coverageStatus = item.coverage_status || coverageStatus
  itemDescription = item.description || itemDescription
  if (typeof item.in_storage === 'boolean') {
    inStorage = item.in_storage
  }
  make = item.make || make
  model = item.model || model
  shortName = item.name || shortName
  if (item.purchase_date) {
    purchaseDate = item.purchase_date
  } else {
    purchaseDate = coverageStartDate
  }
  uniqueIdentifier = item.serial_number || uniqueIdentifier
}
</script>

<Form on:submit={onSubmit}>
  <p>
    <Select label="Category" options={$categories} selectedID={initialCategoryId}
            on:change={onSelectCategory} on:populated={onCategorySelectPopulated} />
  </p>
  <p>
    <TextField label="Short name" bind:value={shortName}></TextField>
    <Description>This label will appear on your statements.</Description>
  </p>
  <p>
    <TextArea label="Item description" bind:value={itemDescription} rows="4"></TextArea>
    <Description>For personal use.</Description>
  </p>
  <p>
    <TextField label="Unique identifier" bind:value={uniqueIdentifier}></TextField>
    <Description>Optional. Serial number, IMEI, service tag, VIN</Description>
  </p>
  <p>
    <TextField label="Make" bind:value={make}></TextField>
    <Description>Required for mobile items.</Description>
  </p>
  <p>
    <TextField label="Model" bind:value={model}></TextField>
    <Description>Required for mobile items.</Description>
  </p>
  <p>
    <!-- TODO: Set the initial value here (like on Category) once the API is providing it. -->
    <Select label="Accountable person" on:change={onAccountablePersonChange}
            options={accountablePersons}></Select>
    <Description>
      Dependents are eligible. Dependents include spouses and children under 26 who haven't
      married or finished college. Coverage for children is limited to $3,000 per household.
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
