<script lang="ts">
import { Checkout } from 'components'
import { deleteItem, loadItems, selectedPolicyItems, submitItem } from 'data/items'
import type { PolicyItem } from 'data/types/items'
import { formatPageTitle } from 'helpers/pageTitle'
import { itemDetails, items, itemEdit } from 'helpers/routes'
import { goto, metatags, params } from '@roxi/routify'
import { Page, setNotice } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let itemId: string

onMount(() => {
  loadItems(policyId)
})

$: policyId = $params.policyId
$: item = $selectedPolicyItems.find((i) => i.id === itemId) as PolicyItem
$: metatags.title = formatPageTitle('Items > Checkout')

const onEdit = () => {
  $goto(itemEdit(policyId, itemId))
}

const onDelete = async (event: CustomEvent<string>) => {
  //don't await this or item will be undefined before the page navigates
  deleteItem(policyId, event.detail).catch((e) => {
    setNotice('There was an error deleting item')
    console.error(e)
  })

  $goto(items(policyId))
}

const onAgreeAndPay = async (event: CustomEvent<string>) => {
  const itemId = event.detail
  await submitItem(itemId)
  $goto(itemDetails(policyId, itemId))
}
</script>

<Page>
  <Checkout {item} {policyId} on:agreeAndPay={onAgreeAndPay} on:delete={onDelete} on:edit={onEdit} />
</Page>
