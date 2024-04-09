<script lang="ts">
import { Dialog } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let open = true
export let itemName = ''

let title = 'Replacement coverage'

const buttons: Dialog.AlertButton[] = [
  { label: 'not now', action: 'cancel', class: 'mdc-button--raised' },
  { label: 'Add Coverage for Replacement', action: 'reCover', class: 'mdc-dialog__button' },
]

const dispatch = createEventDispatcher<{ closed: any }>()

const handleDialog = (e: CustomEvent) => {
  e.detail ? dispatch(e.detail) : dispatch('closed')
}
</script>

<Dialog.Alert {open} {buttons} defaultAction="cancel" {title} on:chosen={handleDialog} on:closed={handleDialog}>
  We’re ending coverage for {itemName} since you’ve replaced it. Would you like to cover its replacement?
</Dialog.Alert>
