<script>
import Breadcrumb from '../../components/Breadcrumb.svelte'
import Description from '../../components/Description.svelte'
import RadioOptions from '../../components/RadioOptions.svelte'
import { goto } from '@roxi/routify'
import { Button, Form, Page, TextArea, TextField } from '@silintl/ui-components'

let formData = {
  shortName: '',
  itemDescription: '',
  riskCategory: '',
  uniqueIdentifier: '',
  make: '',
  model: '',
  accountablePerson: '',
  itemCostUSD: '',
}
let riskCategoryOptions = [
  {
    label: 'Carried with me',
    value: 'mobile',
  },
  {
    label: 'In one place (home or office)',
    value: 'stationary',
  },
]

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
      <TextField label="Short name" bind:value={formData.shortName}></TextField>
      <Description>This label will appear on your statements.</Description>
    </p>
    <p>
      <TextArea label="Item description" bind:value={formData.itemDescription} rows="4"></TextArea>
      <Description>For personal use.</Description>
    </p>
    <p>This item primarily stays:</p>
    <RadioOptions name="riskCategory" options={riskCategoryOptions} bind:value={formData.riskCategory} />
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
      <TextField label="Accountable person" bind:value={formData.accountablePerson}></TextField>
      <Description>
        Dependents are eligible. Dependents include spouses and children under 26 who haven't
        married or finished college. Coverage for children is limited to $3,000 per household.
      </Description>
    </p>
    <p>
      <TextField label="Item cost (USD)" bind:value={formData.itemCostUSD}></TextField>
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
