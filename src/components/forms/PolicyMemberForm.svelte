<script lang="ts">
import RadioOptions from '../RadioOptions.svelte'
import { assertHas } from '../../validation/assertions'
import type { PolicyMember } from 'data/policy-members'
import { Button, Form, TextArea, TextField } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let person: PolicyMember = {}

const dispatch = createEventDispatcher<{ cancel: void; remove: string; submit: any }>()
const permissionOptions = [
  {
    label: 'No login',
    value: 'no-login',
  },
  { label: 'Can edit items and claims for team', value: 'can-edit' },
]

let formData = {
  id: person.id,
  name: person.first_name || '',
  country: person.country || '',
  permissions: person.email ? 'can-edit' : 'no-login',
  email: person.email || '',
  message: '',
}

const validate = () => {
  assertHas(formData.name, 'Please specify a name')
  assertHas(formData.country, 'Please specify a location')
  if (formData.permissions === 'can-edit') {
    assertHas(formData.email, 'Please specify an email')
    assertHas(formData.message, 'Please add a personal message')
  }
}
const onCancel = (event: Event) => {
  event.preventDefault()
  dispatch('cancel')
}
const onRemove = (event: Event) => {
  event.preventDefault()
  dispatch('remove', formData.id)
}
const onSubmit = () => {
  validate()
  dispatch('submit', formData)
}
</script>

<style>
.float-left {
  float: left;
}

.float-right {
  float: right;
}

.form-button {
  margin: 0.5rem;
}
</style>

<div style="min-width: 500px" class={$$props.class}>
  <Form on:submit={onSubmit}>
    <p>
      <TextField label="Person's Name" bind:value={formData.name} class="w-100" autofocus />
    </p>
    <p>
      <TextField label="Primary Location" bind:value={formData.country} class="w-100" />
    </p>
    <p>
      <RadioOptions name="permissions" options={permissionOptions} bind:value={formData.permissions} />
    </p>
    {#if formData.permissions === 'can-edit'}
      <p>
        <TextField label="Email" bind:value={formData.email} class="w-100" />
      </p>
      <p>
        <TextArea
          class="w-100"
          rows="6"
          placeholder="A personalized message for the person you are inviting"
          bind:value={formData.message}
        />
      </p>
    {/if}

    <div class="float-right form-button">
      <Button raised>{formData.permissions === 'no-login' ? 'Save' : 'Invite Person'}</Button>
    </div>
    <div class="float-right form-button">
      <Button on:click={onCancel}>Cancel</Button>
    </div>
    {#if formData.id !== undefined}
      <div class="float-left form-button">
        <Button on:click={onRemove} outlined class="mdc-theme--error">Remove</Button>
      </div>
    {/if}
  </Form>
</div>
