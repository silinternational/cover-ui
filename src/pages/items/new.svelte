<script>
import { Breadcrumb, Description, MoneyInput } from '../../components'
import { goto } from '@roxi/routify'
import { Button, Form, Page, Select, TextArea, TextField } from '@silintl/ui-components'

let formData = {
  categoryUuid: '',
  shortName: '',
  itemDescription: '',
  uniqueIdentifier: '',
  make: '',
  model: '',
  accountablePersonUuid: '',
  marketValueUSD: '',
}

/* @todo Pull this from the database eventually: */
let categoryOptions = [
  {
    "name": "Musical Instrument",
    "id": "11111111-1111-4111-1111-111111111111",
  },
  {
    "name": "Cell Phone",
    "id": "22222222-2222-4222-2222-222222222222",
  },
]

/** @todo Pull this from the API / backend */
let accountablePersonOptions = [
  {
    name: 'Jeff Smith',
    id: '11111111-1111-4111-1111-111111111111',
  },
  {
    name: 'Sarah Smith',
    id: '22222222-2222-4222-2222-222222222222',
  },
]

const onAccountablePersonChange = event => {
  formData.accountablePersonUuid = event.detail.id
  formData.accountablePersonName = event.detail.name
}
const onSubmit = event => {
  // TEMP
  console.log('Form submitted:', event)
  console.log(formData)
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
      <Select label="Category" bind:selectedID={formData.categoryUuid} options={categoryOptions} />
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
              options={accountablePersonOptions}></Select>
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
