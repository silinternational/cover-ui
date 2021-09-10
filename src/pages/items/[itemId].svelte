<script>
import user from '../../authn/user.js'
import { Banner, Breadcrumb } from '../../components'
import { loading } from '../../components/progress'
import { itemsByPolicyId, loadItems } from '../../data/items.js'
import { formatMoney } from '../../helpers/money'
import { goto } from '@roxi/routify'
import { Button } from '@silintl/ui-components'

export let itemId

$: $user.policy_id && loadItems($user.policy_id)
$: items = $itemsByPolicyId[$user.policy_id] || []
$: item = items.find(itm => itm.id === itemId) || {}
$: itemName = item.name || ''

// Dynamic breadcrumbs data:
const itemsBreadcrumb = { name: 'Items', url: '/items' }
$: thisItemBreadcrumb = { name: itemName || 'This item', url: `/items/${itemId}` }
$: breadcrumbLinks = [itemsBreadcrumb, thisItemBreadcrumb]

const goToEditItem = () => {
  $goto(`/items/${itemId}/edit`)
}
const goToNewClaim = () => {
  $goto(`/items/${itemId}/new-claim`)
}
const goToDelete = () => {
  $goto(`/items/${itemId}/delete`)
}
</script>

<style>
.delete-button {
  color: var(--mdc-theme-status-error);
  text-decoration: none;
  margin: 5px;
}

p {
  font-weight: 600;
}

</style>

{#if !item.id } 
  {#if $loading}
    Loading...
  {:else}
    We could not find that item. Please <a href="/items">go back</a> and select
    an item from the list.
  {/if}
{:else}
  <Breadcrumb links={breadcrumbLinks} />
  <h1>{item.name}</h1>
  <h3>{item.make} {item.model}</h3>
  <Banner background="var(--mdc-theme-neutral" class="max-content-width">{item.category?.name}</Banner>
  <p>Market value: {formatMoney(item.coverage_amount)}</p>
  <p>Annual premium: {formatMoney(item.annual_premium)}</p>
  <p>Description: {item.description}</p>
  <p>Accountable person: {item.accountable_person || ''}</p>
  <p>Unique identifier: {item.serial_number}</p>
  <p>Coverage added: {new Date(item.coverage_start_date).toDateString()}</p>
  <p>Coverage ends: {"13 December 2029"}</p>
  <div>
    <Button on:click={goToEditItem} raised>Edit Details</Button>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a on:click={goToDelete} class="delete-button" href="">Remove Coverage</a>
  </div>
  <br />
  <div>
    <Button class="mdc-theme--secondary-background" on:click={goToNewClaim} raised>File Claim</Button>
  </div>
{/if}
