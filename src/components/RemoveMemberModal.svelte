<script lang="ts">
import { howManyItemsAccountablePersonIsOn } from 'data/items'
import { Dialog } from '@silintl/ui-components'
import type { PolicyMember } from 'data/types/policy-members'
import { createEventDispatcher } from 'svelte'

export let open: boolean = false
export let policyMember = {} as PolicyMember
export let policyId: string = ''

let numberOfItemsDependentIsOn = 0

$: numberOfItemsDependentIsOn = howManyItemsAccountablePersonIsOn(policyMember.id, policyId)

const title = 'Remove Person'
const buttonsWithoutItems: Dialog.AlertButton[] = [
  { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
  { label: 'Remove', action: 'remove', class: 'error-button' },
]
const buttonsWithItems: Dialog.AlertButton[] = [
  { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
  { label: 'Items', action: 'gotoItems', class: 'error-button' },
]
$: buttons = !!numberOfItemsDependentIsOn ? buttonsWithItems : buttonsWithoutItems
$: message = !!numberOfItemsDependentIsOn
  ? `Please remove this person from all items before removing.`
  : `Permanently remove this person? This cannot be undone.`

const dispatch = createEventDispatcher<{ remove: string; cancel: string; gotoItems: string; closed: string }>()

const handleDialog = (e: CustomEvent) => {
  e.detail ? dispatch(e.detail) : dispatch('closed')
}
</script>

<Dialog.Alert {open} {buttons} defaultAction="cancel" {title} on:closed={handleDialog} on:chosen={handleDialog}>
  {policyMember.first_name} is accountable for {numberOfItemsDependentIsOn}
  {numberOfItemsDependentIsOn === 1 ? 'item' : 'items'}.

  {message}
</Dialog.Alert>
