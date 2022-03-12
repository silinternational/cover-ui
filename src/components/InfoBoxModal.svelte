<script lang="ts">
import user from 'data/user'
import { itemEdit, settingsPolicy, SETTINGS_PERSONAL } from 'helpers/routes'
import { Dialog } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let open = false
export let sidebarDetailsArray: any[] = []
export let policyId = ''
export let i: number
export let itemId: string

const dispatch = createEventDispatcher()
const getAssingee = (i: number, array: any[]) => array[i - 1]['Assigned To']
const onClosed = () => {
  open = false
  dispatch('closed')
}
</script>

<Dialog.Alert
  {open}
  buttons={[]}
  defaultAction="cancel"
  title="Why is this location empty?"
  titleIcon="info"
  on:closed={onClosed}
>
  {#if getAssingee(i, sidebarDetailsArray)}
    <p>
      Locations are associated with people, not items. {getAssingee(i, sidebarDetailsArray) || 'The assigned person'} doesn’t
      have a location, so neither does the item.
      <a href={getAssingee(i, sidebarDetailsArray) === $user.name ? SETTINGS_PERSONAL : settingsPolicy(policyId)}
        >Set a location→</a
      >
    </p>
  {:else}
    <p>
      Locations are associated with people, not items. This item doesn’t have a person, so it doesn’t have a location. <a
        href={itemEdit(policyId, itemId)}
      >
        Assign a person→
      </a>
    </p>
  {/if}
</Dialog.Alert>
