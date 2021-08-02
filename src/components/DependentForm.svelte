<script>
import { Button, Form, TextField } from '@silintl/ui-components'

const onSubmit = () => {
  console.log('Form submitted:', name)
}

let name = ''
</script>

<div class="w-50">
  <Form on:submit={onSubmit}>
    <TextField label="Dependent Name" bind:value={name} autofocus />
    <p>
      Dependents include non-member spouses and children under 26 who haven't
      married or finished college. Coverage for dependents is limited to $3,000
      per person.
    </p>
    <Button raised>Save</Button>
  </Form>
</div>
