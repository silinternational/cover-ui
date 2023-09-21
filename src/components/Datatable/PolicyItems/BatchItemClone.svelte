<script lang="ts">
import { Button, Dialog } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let isDisabled = false
export let open = false
export let selectedItemNames = [] as string[]

let names: string

$: names = selectedItemNames.reduce((sum: string, curr: string, i: number, arr: any[]): string => {
  const midChunk = i === arr.length - 1 ? ' and ' : ', '
  const chunk = sum + midChunk + curr
  return i === 0 ? curr : chunk
}, '')

const dispatch = createEventDispatcher<{ closed: 'clone' | 'cancel' }>()

const buttons: Dialog.AlertButton[] = [
  { label: 'Yes, Clone', action: 'clone', class: 'mdc-dialog__button' },
  { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
]

$: title = 'Clone Coverage'
$: message = `Are you sure you would like to clone coverage for ${names}?`

const handleDialog = (choice: 'clone' | 'cancel') => {
  open = false
  dispatch('closed', choice)
}
</script>

<Button disabled={isDisabled} on:click={() => (open = true)}>Duplicate</Button>

<Dialog.Alert
  {open}
  {buttons}
  defaultAction="cancel"
  {title}
  on:chosen={(e) => handleDialog(e.detail)}
  on:closed={handleDialog}>{message}</Dialog.Alert
>
