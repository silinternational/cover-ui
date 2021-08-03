<script>
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
let itemDescription = ' '

const onChange = event => console.log('Item type changed:', event.detail)
const onSubmit = event => console.log('Form submitted:', event.detail)
</script>

<style>
.field-details {
    color: rgba(0, 0, 0, 0.5);
    display: block;
    padding: 0.5rem 1rem;
}
</style>

<Page>
  <Form on:submit={onSubmit}>
    <p>
      <Select label="Item type" bind:selectedID={itemTypeUuid} options={itemTypeOptions} on:change={onChange} />
    </p>
    <p>
      <TextField label="Short name" bind:value={shortName}></TextField>
      <span class="field-details">This label will appear on your statements.</span>
    </p>
    <p>
      <TextArea bind:value={itemDescription} rows="4"></TextArea>
      <span class="field-details">For personal use.</span>
    </p>
  </Form>
</Page>
