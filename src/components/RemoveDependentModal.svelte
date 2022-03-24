<script lang="ts">
import { isDependentOnItemsByPolicyId } from 'data/items'
import { createEventDispatcher, onMount } from 'svelte'
import { Dialog } from '@silintl/ui-components'

export let open: boolean = false
export let dependentId: string
export let policyId: string = ''

let dependentIsOnItems: boolean = false

onMount(() => {
  dependentIsOnItems = isDependentOnItemsByPolicyId(dependentId, policyId)
})

const title = 'Remove Dependent'
const buttonsWithoutItems: Dialog.AlertButton[] = [
  { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
  { label: 'Remove', action: 'remove', class: 'error-button' },
]
const buttonsWithItems: Dialog.AlertButton[] = [
  { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
  { label: 'Items', action: 'gotoItems', class: 'error-button' },
]
$: buttons = dependentIsOnItems ? buttonsWithItems : buttonsWithoutItems
$: message = dependentIsOnItems
  ? `Please remove this dependent from all items before removing.`
  : `Permanently remove this dependent?`

const dispatch = createEventDispatcher<{ remove: string; cancel: string; gotoItems: string; closed: string }>()

const handleDialog = (e: CustomEvent) => {
  e.detail ? dispatch(e.detail) : dispatch('closed')
}
</script>

<Dialog.Alert {open} {buttons} defaultAction="cancel" {title} on:closed={handleDialog} on:chosen={handleDialog}>
  {message}
</Dialog.Alert>
