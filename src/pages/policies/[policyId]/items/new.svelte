<script lang="ts">
import { Breadcrumb, ItemForm, NoHouseholdIdModal } from 'components'
import { loadDependents } from 'data/dependents'
import { addItem, loadItems, PolicyItem, selectedPolicyItems, updateItem } from 'data/items'
import { PolicyType, selectedPolicy, updatePolicy } from 'data/policies'
import { loadMembersOfPolicy } from 'data/policy-members'
import { formatPageTitle } from 'helpers/pageTitle'
import { HOME, items as itemsRoute, itemsCheckout, itemsNew, itemsNewId } from 'helpers/routes'
import qs from 'qs'
import { goto, metatags, params, redirect } from '@roxi/routify'
import { Page, setNotice } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let policyId: string

let item = {} as PolicyItem
let open = false

onMount(() => {
  loadDependents(policyId)
  loadMembersOfPolicy(policyId)
  loadItems(policyId)
})

$: metatags.title = formatPageTitle('Items > New')

$: item.id && $redirect(itemsNewId(policyId, qs.stringify({ itemId: item.id })))
$: $selectedPolicy.type === PolicyType.Household && !$selectedPolicy.household_id && (open = true)

$: $params.itemId && (item = $selectedPolicyItems.find((i) => i.id === $params.itemId) || {})
$: breadcrumbLinks = [
  { name: 'Items', url: itemsRoute(policyId) },
  { name: 'New', url: item.id ? itemsNewId(policyId, qs.stringify({ itemId: item.id })) : itemsNew(policyId) },
]

const onApply = async (event: CustomEvent) => {
  await saveOrAddItem(event)
  $goto(itemsCheckout(policyId, item.id))
}

const onSaveForLater = async (event: CustomEvent) => {
  saveOrAddItem(event)

  if (!event.detail.isAutoSaving) {
    $goto(HOME)
  }
}

const saveOrAddItem = async (event: CustomEvent) =>
  item.id ? await updateItem(policyId, item.id, event.detail) : (item = await addItem(policyId, event.detail))

const onClosed = async (event: CustomEvent<any>) => {
  const choice = event.detail.choice
  if (choice === 'submit') {
    await updatePolicy(policyId, event.detail.data)
    setNotice('Your household ID has been saved')
  } else {
    history.back()
  }
  open = false
}
</script>

<Page>
  <Breadcrumb links={breadcrumbLinks} />
  <ItemForm {item} {policyId} on:submit={onApply} on:save-for-later={onSaveForLater} />
  <NoHouseholdIdModal {open} on:closed={onClosed} />
</Page>
