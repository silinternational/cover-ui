<script>
import user from '../../authn/user.js'
import { addItem } from '../../data/items.js'
import { dependents, loadDependents, initialized as depsInitialized } from '../../data/dependents.js'
import { categories as categoryOptions, init, initialized as catItemsInitialized } from '../../data/itemCategories'
import { Breadcrumb, Description, MoneyInput } from '../../components'
import { goto } from '@roxi/routify'
import { Button, Form, Page, Select, TextArea, TextField } from '@silintl/ui-components'

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
$: accountablePersons = $dependents //TODO add current User to this: = [$dependents..., currentUser]
$: if ($catItemsInitialized) categories = $categoryOptions.length ? $categoryOptions : [{name: 'Electronics', id: '63bcf980-e1f0-42d3-b2b0-2e4704159f4f'}] //TODO categoriesOptions isn't hydrating yet, remove mock data
$: ! $depsInitialized && $user.policy_id && loadDependents($user.policy_id)
$: ! $catItemsInitialized && init()

const onAccountablePersonChange = event => {
  formData.country = event.detail?.location //TODO handle when Dependents is empty, redirect to settings?
}

const onSelectCategory = event => {
  formData.category = event.detail?.id
}

const onSubmit = async () => {
  await addItem($user.policy_id, formData)

  $goto('/home')
}
const saveForLater = () => {
  /* @todo Save this as an item draft. */
  $goto('/home')
}
</script>

<Page>
  <Breadcrumb />
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
        To convert to USD, use 
        <a href="https://www.google.com/search?q=currency+converter" target="_blank">this converter</a>.
      </Description>
    </p>
    <p>
      <Button outlined on:click={saveForLater}>Save for later</Button>
      <Button raised>Get approval</Button>
    </p>
  </Form>
</Page>
