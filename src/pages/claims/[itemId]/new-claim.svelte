<script>
import Breadcrumb from '../../../components/Breadcrumb.svelte'
import Description from '../../../components/Description.svelte'
import RadioOptions from '../../../components/RadioOptions.svelte'
import Required from '../../../components/Required.svelte'
import DateInput from '../../../components/DateInput.svelte'
import MoneyInput from '../../../components/MoneyInput.svelte'
import { goto } from '@roxi/routify'
import { Button, Form, Page, Select, TextArea, TextField } from '@silintl/ui-components'

let formData = {
  lostDate: new Date().toISOString().split('T')[0],
  lossReason: '',
  situationDescription: '',
  uniqueIdentifier: '',
  make: '',
  model: '',
  accountablePersonUuid: '',
  itemCostUSD: '',
}
const reasonsForLoss = [
  {
    label: 'Theft',
    value: 'theft',
  },
  {
    label: 'Dropped',
    value: 'dropped',
  },
  {
    label: 'Lightning',
    value: 'lightning',
  },
  {
    label: 'Evacuation',
    value: 'evacuation',
    description: 'For bulk claims due to large-scale events',
  }
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
      <DateInput bind:value={formData.lostDate} />
      <Description>Date lost or damaged<Required /></Description>
    </p>
    <p>Reason for loss or damage<Required /></p>
    <RadioOptions name="lossReason" options={reasonsForLoss} bind:value={formData.lossReason} />
    <p>
      <TextArea label="Describe the situation" bind:value={formData.situationDescription} rows="4"></TextArea>
      <Description>What happened?<Required /></Description>
    </p>
    <p>
      <MoneyInput label="Fair market value" bind:value={formData.itemCostUSD}></MoneyInput>
      <Description>
        To convert to USD, use 
        <a href="https://www.google.com/search?q=currency+converter" target="_blank">this converter</a>.
      </Description>
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