<script lang="ts">
import { type AccountablePersonOptions, selectedAccountablePersonOptions } from 'data/accountablePersons'
import type { PolicyDependent } from 'data/dependents'
import { howManyItemsAccountablePersonIsOn } from 'data/items'
import RadioOptions from './RadioOptions.svelte'
import { Dialog, Select } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let open: boolean = false
export let dependent = {} as PolicyDependent
export let policyId: string = ''

const options = [
  { label: 'No one', value: 'no-one' },
  { label: 'Accountable person', value: 'accountable-person' },
]

let numberOfItemsDependentIsOn = 0
let radioValue = 'no-one'
let selectedAccountablePersonOption: AccountablePersonOptions

$: numberOfItemsDependentIsOn = howManyItemsAccountablePersonIsOn(dependent.id, policyId)
$: personOptions = $selectedAccountablePersonOptions.filter((o) => o.id !== dependent.id)

const title = 'Remove Dependent'
const cancelButton: Dialog.AlertButton[] = [{ label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' }]
const allTheButtons: Dialog.AlertButton[] = [
  ...cancelButton,
  { label: 'Remove', action: 'remove', class: 'error-button' },
]

$: buttons = selectedAccountablePersonOption || radioValue === 'no-one' ? allTheButtons : cancelButton

const dispatch = createEventDispatcher<{ remove: string }>()

const handleDialog = (e: CustomEvent) => {
  if (e.detail === 'remove') {
    dispatch('remove', selectedAccountablePersonOption.id)
  }
}
const onSelect = (e: CustomEvent) => {
  selectedAccountablePersonOption = e.detail
}
</script>

<Dialog.Alert {open} {buttons} defaultAction="cancel" {title} on:closed on:cancel on:chosen={handleDialog}>
  {dependent.name} is accountable for {numberOfItemsDependentIsOn}
  {numberOfItemsDependentIsOn === 1 ? 'item' : 'items'}.

  {#if numberOfItemsDependentIsOn > 0}
    <div class="mdc-typography--headline6 mt-2">Assign items to</div>
    <RadioOptions name="accountable-person" bind:value={radioValue} {options} />
  {/if}

  {#if radioValue === 'accountable-person'}
    <Select label="Input" options={personOptions} on:change={onSelect} />
  {/if}

  <p>This cannot be undone.</p>
</Dialog.Alert>
