<script lang="ts">
import { Dialog } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let open = false
export let selectedItemNames = [] as string[]

let names: string

$: names = selectedItemNames.reduce(
  (sum, curr, i) => (i === 0 ? curr : sum + (i === selectedItemNames.length - 1 ? ' and ' : ', ') + curr),
  ''
)

const dispatch = createEventDispatcher<{ closed: string }>()

const buttons: Dialog.AlertButton[] = [
  { label: 'Yes, Clone', action: 'clone', class: 'mdc-theme--primary' },
  { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
]

$: title = 'Clone Coverage'
$: message = `Are you sure you would like to clone coverage for ${names}?`

const handleDialog = (choice: string) => {
  open = false
  dispatch('closed', choice)
}
</script>

<Dialog.Alert
  {open}
  {buttons}
  defaultAction="cancel"
  {title}
  on:chosen={(e) => handleDialog(e.detail)}
  on:closed={handleDialog}>{message}</Dialog.Alert
>
