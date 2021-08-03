<script>
import Description from '../../components/Description.svelte'
import { Form, Page, Select, TextArea, TextField } from '@silintl/ui-components'

/* @todo Pull this from the database eventually: */
const itemTypeOptions = [
  {
    "name": "Musical Instrument",
    "id": "11111111-1111-4111-1111-111111111111",
  },
  {
    "name": "Cell Phone",
    "id": "22222222-2222-4222-2222-222222222222",
  },
]
let shortName = ''
let itemTypeUuid
let itemDescription = ''

const onChange = event => console.log('Item type changed:', event.detail)
const onSubmit = event => console.log('Form submitted:', event.detail)
</script>

<Page>
  <Form on:submit={onSubmit}>
    <p>
      <Select label="Item type" bind:selectedID={itemTypeUuid} options={itemTypeOptions} on:change={onChange} />
    </p>
    <p>
      <TextField label="Short name" bind:value={shortName}></TextField>
      <Description>This label will appear on your statements.</Description>
    </p>
    <p>
      <TextArea label="Item description" bind:value={itemDescription} rows="4"></TextArea>
      <Description>For personal use.</Description>
    </p>
  </Form>
</Page>
