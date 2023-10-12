<script>
import { Dialog } from '@silintl/ui-components'

export let infoIsOpen = false
export let title = ''
</script>

<Dialog.Alert
  open={infoIsOpen}
  buttons={[{ label: 'Ok', action: 'cancel', class: 'mdc-dialog__button' }]}
  defaultAction="cancel"
  {title}
  titleIcon="info"
  on:closed
>
  <slot />
</Dialog.Alert>
