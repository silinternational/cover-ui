<script lang="ts">
import { TextFieldWithLabel } from 'components/index'
import { Button, Dialog, Form } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let title = 'Create an Entity'

const formData = { code: '', name: '', income_account: '', parent_entity: '', active: false }

const dispatch = createEventDispatcher()

let open = false

const onSubmit = (event: any) => {
  dispatch('submit', formData)
  event.target.reset()
  open = false
}
</script>

<style>
.form-button {
  float: right;
  margin: 0.5rem;
}
</style>

<Button class={'mb-1'} raised on:click={() => (open = true)}>add an entity</Button>

<Dialog.Alert {open} buttons={[]} defaultAction="cancel" {title} titleIcon="info" on:closed={() => (open = false)}>
  <Form on:submit={onSubmit}>
    <div class="my-1">
      <p>
        <TextFieldWithLabel required label="Code" bind:value={formData.code} />
      </p>
      <p>
        <TextFieldWithLabel required label="Name" bind:value={formData.name} />
      </p>
      <p>
        <TextFieldWithLabel required label="Income Account" bind:value={formData.income_account} />
      </p>
      <p>
        <TextFieldWithLabel label="Parent Entity" bind:value={formData.parent_entity} />
      </p>
      <p>
        <label>
          <input type="checkbox" bind:checked={formData.active} />
          Active
        </label>
      </p>
    </div>
    <div class="form-button">
      <Button raised>Create Entity</Button>
    </div>
    <div class="form-button">
      <Button on:click|preventDefault={() => (open = false)}>Cancel</Button>
    </div>
  </Form>
</Dialog.Alert>
