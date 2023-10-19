<script lang="ts">
import { Checkout } from 'components'
import { deleteItem, loadItems, PolicyItem, selectedPolicyItems, submitItem } from 'data/items'
import { formatPageTitle } from 'helpers/pageTitle'
import { itemDetails, items, itemEdit } from 'helpers/routes'
import { goto, metatags, params } from '@roxi/routify'
import { Page, setNotice } from '@silintl/ui-components'
import { onMount } from 'svelte'
import { set } from 'date-fns'

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
  deleteItem(policyId, event.detail).then(
    () => null,
    (e) => {
      setNotice('There was an error deleting item')
      console.error(e)
    }
  )

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
