<script lang="ts">
import { COVER_EMAIL } from './const'
import type { UpdatePolicyRequestBody } from 'data/policies'
import { COVER_EMAIL_HREF, POLICY_NEW_TEAM } from 'helpers/routes'
import { Dialog } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let open = false

let title = 'Missing information'
let hasClosed: boolean = false

const buttons: Dialog.AlertButton[] = [{ label: 'Go Back', action: 'cancel', class: 'mdc-dialog__button' }]

const dispatch = createEventDispatcher<{ closed: { choice: string; data?: UpdatePolicyRequestBody } }>()

const handleDialog = (event: CustomEvent) => {
  const choice: string = event.detail || ''
  if (choice === 'cancel') {
    dispatch('closed', { choice })
    hasClosed = true
    // prevents emiiting a second 'closed' event
  } else if (!hasClosed) {
    dispatch('closed', { choice })
  }
}
</script>

<Dialog.Alert {open} {buttons} defaultAction="cancel" {title} on:chosen={handleDialog} on:closed={handleDialog}>
  <p>
    A household ID is required before getting coverage. Please contact <a
      class="mdc-theme--primary"
      href={COVER_EMAIL_HREF}>{COVER_EMAIL}</a
    > to add your household ID.
  </p>
  <p>
    If you'd like to pay with a cost center, consider creating a <a class="mdc-theme--primary" href={POLICY_NEW_TEAM}
      >Team Policy</a
    >.
  </p>
</Dialog.Alert>
