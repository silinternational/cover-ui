<script lang="ts">
import { Breadcrumb, ItemForm, NoHouseholdIdModal } from 'components'
import { loadDependents } from 'data/dependents'
import { addItem, loadItems, PolicyItem, updateItem } from 'data/items'
import { PolicyType, selectedPolicy, updatePolicy } from 'data/policies'
import { loadMembersOfPolicy } from 'data/policy-members'
import { formatPageTitle } from 'helpers/pageTitle'
import { HOME, items as itemsRoute, itemsCheckout, itemEdit, itemsNew } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { Page, setNotice } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let policyId: string

let item = {} as PolicyItem
let open = false

onMount(() => {
  loadDependents(policyId)
  loadMembersOfPolicy(policyId)
})

$: metatags.title = formatPageTitle('Items > New')

$: policyId && loadItems(policyId)

$: $selectedPolicy.type === PolicyType.Household && !$selectedPolicy.household_id && (open = true)

$: breadcrumbLinks = [
  { name: 'Items', url: itemsRoute(policyId) },
  { name: 'New', url: itemsNew(policyId) },
]

const onApply = async (event: CustomEvent) => {
  item = await addItem(policyId, event.detail)
  $goto(itemsCheckout(policyId, item.id))
}

const onSaveForLater = async (event: CustomEvent) => {
  item.id ? await updateItem(policyId, item.id, event.detail) : (item = await addItem(policyId, event.detail))

  if (event.detail.isAutoSaving) {
    //Todo once autosaving can happen on an empty form send the user immediately to edit.
    // $goto(itemEdit(policyId, item.id))
  } else {
    $goto(HOME)
  }
}

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
