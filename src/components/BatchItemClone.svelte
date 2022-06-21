<script lang="ts">
import { Button, Dialog } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let disabled = false
export let open = false
export let selectedItemNames = [] as string[]

let names: string

$: names = selectedItemNames.reduce(
  (sum, curr, i) => (i === 0 ? curr : sum + (i === selectedItemNames.length - 1 ? ' and ' : ', ') + curr),
  ''
)

const dispatch = createEventDispatcher<{ closed: string }>()

const buttons: Dialog.AlertButton[] = [
  { label: 'Yes, Clone', action: 'clone', class: 'mdc-dialog__button' },
  { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
]

$: title = 'Clone Coverage'
$: message = `Are you sure you would like to clone coverage for ${names}?`

const handleDialog = (choice: string) => {
  open = false
  dispatch('closed', choice)
}
</script>

<Button {disabled} on:click={() => (open = true)}>clone coverage</Button>

<Dialog.Alert
  {open}
  {buttons}
  defaultAction="cancel"
  {title}
  on:chosen={(e) => handleDialog(e.detail)}
  on:closed={handleDialog}>{message}</Dialog.Alert
>
