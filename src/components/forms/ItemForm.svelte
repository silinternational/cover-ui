<script>
import { ConvertCurrencyLink, Description, MoneyInput } from '../../components'
import { dependentsByPolicyId, loadDependents } from '../../data/dependents.js'
import { categories as categoryOptions, init, initialized as catItemsInitialized } from '../../data/itemCategories'
import { loadMembersOfPolicy, membersByPolicyId } from '../../data/policy-members'
import { Button, Form, Select, TextArea, TextField } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let item = {}
export let policyId = undefined

const dispatch = createEventDispatcher()

// Set default values.
let category = ''
let country = ''
let marketValueUSD = ''
let coverageStartDate = ''
let coverageStatus = 'Draft'
let itemDescription = ''
let inStorage = false  //TODO get data from somewhere
let make = ''
let model = ''
let shortName = ''
let purchase_date = ''  //TODO get data from somewhere
let uniqueIdentifier = ''

let categories = []
let today = new Date()

$: coverageStartDate = today.toISOString().slice(0, 10) //api requires yyyy-mm-dd
$: purchase_date = coverageStartDate

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

$: if ($catItemsInitialized) categories = $categoryOptions.length ? $categoryOptions : [{
  name: 'Electronics',
  id: '63bcf980-e1f0-42d3-b2b0-2e4704159f4f'
}] //TODO categoriesOptions isn't hydrating yet, remove mock data
$: policyId && loadDependents(policyId)
$: policyId && loadMembersOfPolicy(policyId)
$: !$catItemsInitialized && init()

const onAccountablePersonChange = event => {
  country = event.detail?.location //TODO handle when Dependents is empty, redirect to settings?
}

const onSelectCategory = event => {
  category = event.detail?.id
}

const getFormData = () => {
  return {
    category,
    country,
    marketValueUSD,
    coverageStartDate,
    coverageStatus,
    itemDescription,
    inStorage,
    make,
    model,
    shortName,
    purchase_date,
    uniqueIdentifier,
  }
}
const onSubmit = () => {
  dispatch('submit', getFormData())
}
const saveForLater = () => {
  dispatch('save-for-later', getFormData())
}
</script>

<Form on:submit={onSubmit}>
  <p>
    <Select label="Category" on:change={onSelectCategory} options={categories} />
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
