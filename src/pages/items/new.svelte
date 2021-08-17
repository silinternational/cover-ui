<script>
import user from '../../authn/user.js'
import { addItem } from '../../data/items.js'
import { dependents, loadDependents, initialized as depsInitialized } from '../../data/dependents.js'
import { categories as categoryOptions, init, initialized as CatItemsInitialized } from '../../data/itemCategories'
import { formatDate } from '../../dates.js'
import { Breadcrumb, Description, MoneyInput } from '../../components'
import { goto } from '@roxi/routify'
import { Button, Form, Page, Select, TextArea, TextField } from '@silintl/ui-components'
import { onMount } from 'svelte'

const formData = {
  category: '',
  country: '',
  marketValueUSD: '',
  coverage_start_date: startDate,
  coverage_status: 'Draft',
  itemDescription: '',
  in_storage: false,  //TODO get data from somewhere
  make: '',
  model: '',
  shortName: '',
  purchase_date: '',  //TODO get data from somewhere
  uniqueIdentifier: '',
}

const dateFormat = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
}
  
const [day, month, year] = formatDate(Date(), 'en-US', dateFormat).split('/')  //en-US to give consistent response

$: startDate = `${year}/${formatMonthOrDay(month)}/${formatMonthOrDay(day)}` //api requires yyyy-mm-dd

onMount(() => {
  if($CatItemsInitialized === false) init()

  if($depsInitialized === false) loadDependents()
})

const formatMonthOrDay = unit => unit.length === 1 ? `0${unit}` : unit

const onAccountablePersonChange = event => {
  formData.country = event.detail.location
}
const onSubmit = event => {
  // TEMP
  formData.category = $categoryOptions.find(cat => cat.id === formData.category)
  addItem($user.policy_id, formData)
  /* @todo Save this to the API / backend. */
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
      <Select label="Category" bind:selectedID={formData.category} options={$categoryOptions} />
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
              options={$dependents}></Select>
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
