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

const formData = {
  category: '',
  country: '',
  marketValueUSD: '',
  coverage_start_date: '',
  coverage_status: 'Draft',
  itemDescription: '',
  in_storage: false,  //TODO get data from somewhere
  make: '',
  model: '',
  shortName: '',
  purchase_date: '',  //TODO get data from somewhere
  uniqueIdentifier: '',
}

let categories = []
let today = new Date()

$: formData.coverage_start_date = today.toISOString().slice(0, 10) //api requires yyyy-mm-dd
$: formData.purchase_date = formData.coverage_start_date

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
  formData.country = event.detail?.location //TODO handle when Dependents is empty, redirect to settings?
}

const onSelectCategory = event => {
  formData.category = event.detail?.id
}

const onSubmit = () => {
  dispatch('submit', formData)
}
const saveForLater = () => {
  dispatch('save-for-later', formData)
}
</script>

<Form on:submit={onSubmit}>
  <p>
    <Select label="Category" on:change={onSelectCategory} options={categories} />
  </p>
  <p>
    <TextField label="Short name" bind:value={formData.shortName}></TextField>
    <Description>This label will appear on your statements.</Description>
  </p>
  <p>
    <TextArea label="Item description" bind:value={formData.itemDescription} rows="4"></TextArea>
    <Description>For personal use.</Description>
  </p>
  <p>
    <TextField label="Unique identifier" bind:value={formData.uniqueIdentifier}></TextField>
    <Description>Optional. Serial number, IMEI, service tag, VIN</Description>
  </p>
  <p>
    <TextField label="Make" bind:value={formData.make}></TextField>
    <Description>Required for mobile items.</Description>
  </p>
  <p>
    <TextField label="Model" bind:value={formData.model}></TextField>
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
    <MoneyInput label="Market value (USD)" bind:value={formData.marketValueUSD} />
    <Description>
      <ConvertCurrencyLink />
    </Description>
  </p>
  <p>
    <Button outlined on:click={saveForLater}>Save for later</Button>
    <Button raised>Get approval</Button>
  </p>
</Form>
