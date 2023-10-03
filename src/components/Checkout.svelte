<script lang="ts">
import CheckoutMessage from './CheckoutMessage.svelte'
import type { PolicyItem } from 'data/items'
import { selectedPolicy } from 'data/policies'
import { HOME, TERMS_OF_SERVICE } from 'helpers/routes'
import ItemDeleteModal from './ItemDeleteModal.svelte'
import ItemDetails from './ItemDetails.svelte'
import { goto } from '@roxi/routify'
import { Button, Checkbox } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let item = {} as PolicyItem
export let policyId: string

let open: boolean = false
let checked: boolean = false

$: itemId = item.id

$: policy = $selectedPolicy

const dispatch = createEventDispatcher<{ agreeAndPay: string; delete: string; edit: string }>()

const onAgreeAndPay = () => {
  dispatch('agreeAndPay', itemId)
}

const handleRemoveDialog = (event: CustomEvent<string>) => {
  open = false
  if (event.detail === 'remove') {
    dispatch('delete', itemId)
  }
}
</script>

<style>
.agreement {
  padding: 1rem 20% 1rem 1rem;
}
</style>

<h1>Review Coverage and Checkout</h1>

<ItemDetails {item} isCheckingOut {policyId}>
  <span slot="headerButtonGroup">
    <Button class="mx-5px" on:click={() => (open = true)}>Discard</Button>
    <ItemDeleteModal {open} {item} on:closed={handleRemoveDialog} />
    <Button outlined on:click={$goto(HOME)}>Save for later</Button>
    <Button raised on:click={() => dispatch('edit')}>Edit Item</Button>
  </span>
</ItemDetails>

<div class="flex align-items-center my-2">
  <Checkbox on:checked={() => (checked = true)} on:unchecked={() => (checked = false)} />

  <span class="mr-3px">I have reviewed and agree to</span><a target="_blank" rel="noreferrer" href={TERMS_OF_SERVICE}>
    Terms of Service</a
  >
</div>

<div class="agreement flex align-items-center">
  <CheckoutMessage {item} {policy} />
  <Button class="ml-1" disabled={!checked} raised on:click={onAgreeAndPay}>Agree and Pay</Button>
</div>
