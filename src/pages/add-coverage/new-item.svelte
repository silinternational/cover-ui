<script>
import Description from '../../components/Description.svelte'
import { Form, Page, TextArea, TextField } from '@silintl/ui-components'

let shortName = ''
let itemDescription = ''

const onSubmit = event => console.log('Form submitted:', event.detail)
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
  </Form>
</Page>
