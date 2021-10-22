<script lang="ts">
import user from '../../authn/user'
import Checkout from 'Checkout.svelte'
import { Breadcrumb, ItemForm } from 'components'
import { loadDependents } from 'data/dependents'
import { addItem, deleteItem, loadItems, PolicyItem, submitItem } from 'data/items'
import { loadMembersOfPolicy } from 'data/policy-members'
import { formatPageTitle } from 'helpers/pageTitle'
import { HOME, ITEMS, item as itemRoute } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

let isCheckingOut: boolean = false
let item: PolicyItem

$: policyId = $user.policy_id

$: policyId && loadDependents(policyId)
$: policyId && loadMembersOfPolicy(policyId)
$: metatags.title = formatPageTitle('Items > New')

$: policyId && loadItems(policyId)

const onApply = async (event: CustomEvent) => {
  item = await addItem(policyId, event.detail)
  isCheckingOut = true
}

const onSaveForLater = async (event: CustomEvent) => {
  await addItem(policyId, event.detail)

  $goto(HOME)
}

const onAgreeAndPay = async (event: CustomEvent<string>) => {
  const itemId = event.detail
  await submitItem(policyId, itemId)
  $goto(itemRoute(itemId))
}

const onDelete = async (event: CustomEvent<string>) => {
  await deleteItem(policyId, event.detail)
  $goto(ITEMS)
}
</script>

<Page>
  {#if !isCheckingOut}
    <Breadcrumb />
    <ItemForm {item} {policyId} on:submit={onApply} on:save-for-later={onSaveForLater} />
  {:else}
    <Checkout {item} {policyId} bind:isCheckingOut on:agreeAndPay={onAgreeAndPay} on:delete={onDelete} />
  {/if}
</Page>
