<script lang="ts">
import { TextFieldWithLabel } from 'components/index'
import { Button, Dialog, Form } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let title = 'Create an Entity'

const formData = { code: '', name: '', income_account: '', parent_entity: '', active: false }

const dispatch = createEventDispatcher()

let open = false

const onSubmit = () => {
  dispatch('submit', formData)
  open = false
}
</script>

<style>
.form-button {
  float: right;
  margin: 0.5rem;
}
</style>

<Button class={'mt-1'} raised on:click={() => (open = true)}>add an entity</Button>

<Dialog.Alert {open} buttons={[]} defaultAction="cancel" {title} titleIcon="info" on:closed={() => (open = false)}>
  <Form on:submit={onSubmit}>
    <div class="my-1">
      <TextFieldWithLabel required label="code" bind:value={formData.code} />

      <TextFieldWithLabel required label="name" bind:value={formData.name} />

      <TextFieldWithLabel required label="Income Account" bind:value={formData.income_account} />

      <TextFieldWithLabel label="Parent Entity" bind:value={formData.parent_entity} />

      <label>
        <input type="checkbox" bind:checked={formData.active} />
        Active
      </label>
    </div>
    <div class="form-button">
      <Button raised>Create Entity</Button>
    </div>
    <div class="form-button">
      <Button on:click={() => (open = false)}>Cancel</Button>
    </div>
  </Form>
</Dialog.Alert>
