<script>
import { Button, Form, TextField } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

let name = ''

const onCancel = () => {
  dispatch('cancel')
}
const onSubmit = () => {
  dispatch('submit', { name })
}
</script>

<div class="w-50">
  <Form on:submit={onSubmit}>
    <TextField label="Dependent Name" bind:value={name} autofocus />
    <p>
      Dependents include non-member spouses and children under 26 who haven't
      married or finished college. Coverage for dependents is limited to $3,000
      per person.
    </p>
    <Button on:click={onCancel}>Cancel</Button>
    <Button raised>Save</Button>
  </Form>
</div>
