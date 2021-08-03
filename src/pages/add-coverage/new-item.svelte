<script>
import Description from '../../components/Description.svelte'
import RadioOptions from '../../components/RadioOptions.svelte'
import { Form, Page, TextArea, TextField } from '@silintl/ui-components'

let shortName = ''
let itemDescription = ''
let riskCategoryOptions = [
  {
    'label': 'Carried with me',
    'value': 'mobile',
  },
  {
    'label': 'In one place (home or office)',
    'value': 'stationary',
  },
]
let riskCategory = ''
let uniqueIdentifier
let make
let model

const onSubmit = event => {
  console.log('Form submitted:', event)
  console.log(
    shortName,
    itemDescription,
    riskCategory,
    uniqueIdentifier,
    make,
    model
  )
}
</script>

<Page>
  <Form on:submit={onSubmit}>
    <p>
      <TextField label="Short name" bind:value={shortName}></TextField>
      <Description>This label will appear on your statements.</Description>
    </p>
    <p>
      <TextArea label="Item description" bind:value={itemDescription} rows="4"></TextArea>
      <Description>For personal use.</Description>
    </p>
    <p>This item primarily stays:</p>
    <RadioOptions name="riskCategory" options={riskCategoryOptions} bind:value={riskCategory} />
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
  </Form>
</Page>
