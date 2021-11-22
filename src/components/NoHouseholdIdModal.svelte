<script lang="ts">
import type { UpdatePolicyRequestBody } from 'data/policies'
import { Dialog, setNotice, TextField } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let open = false

const policyData: UpdatePolicyRequestBody = {}

let title = 'Missing information'
let householdId = ''
let hasClosed: boolean = false

const buttons: Dialog.AlertButton[] = [
  { label: 'Go Back', action: 'cancel', class: 'mdc-dialog__button' },
  { label: 'Submit', action: 'submit', class: 'mdc-button--raised' },
]

const dispatch = createEventDispatcher<{ closed: { choice: string; data?: UpdatePolicyRequestBody } }>()

const handleDialog = (event: CustomEvent) => {
  const choice: string = event.detail || ''
  if (choice === 'submit') {
    householdId = householdId.replaceAll(' ', '')
    if (isIdValid(householdId)) {
      policyData.household_id = householdId
      dispatch('closed', { choice, data: policyData })
      hasClosed = true
    } else {
      setNotice('Please enter a valid Household ID')
    }
  } else if (choice === 'cancel') {
    dispatch('closed', { choice })
    hasClosed = true
    // prevents emiiting a second 'closed' event
  } else if (!hasClosed) {
    dispatch('closed', { choice })
  }
}

const isIdValid = (sanitizedId: string): boolean =>
  (sanitizedId.length > 0) && sanitizedId.split('').every((digit) => /[0-9]/.test(digit))
</script>

<style>
.required {
  color: var(--mdc-theme-status-error);
}
</style>

<Dialog.Alert {open} {buttons} defaultAction="cancel" {title} on:chosen={handleDialog} on:closed={handleDialog}>
  <p>A household ID is required before getting coverage</p>
  <span class="header">Household ID<span class="required">*</span></span>
  <TextField placeholder={'1234567'} bind:value={householdId} /></Dialog.Alert
>
