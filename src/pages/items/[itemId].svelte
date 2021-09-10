<script>
import user from '../../authn/user.js'
import { Banner, Breadcrumb, ClaimBanner, Row } from '../../components'
import { day } from '../../components/const.js'
import { formatDate } from '../../components/dates.js'
import { loading } from '../../components/progress'
import { itemsByPolicyId, loadItems } from '../../data/items.js'
import { init, policies } from '../../data/policies'
import { formatMoney } from '../../helpers/money'
import { goto } from '@roxi/routify'
import { Button, Page } from '@silintl/ui-components'

export let itemId

const now = Date.now()

let householdId = ''

$: $user.policy_id && loadItems($user.policy_id)

$: $policies.length || init()
$: policyId = $user.policy_id
$: policy = $policies.find(policy => policy.id === policyId) || {}
$: policy.household_id && setPolicyHouseholdId()

$: items = $itemsByPolicyId[$user.policy_id] || []
$: item = items.find(itm => itm.id === itemId) || {}
$: itemName = item.name || ''

$: msAgo = now - Date.parse(item.updated_at)
$: daysAgo = msAgo > 0 ? Math.floor(msAgo/day) : '-'
$: startDate = formatDate(item.coverage_start_date)

// Dynamic breadcrumbs data:
const itemsBreadcrumb = { name: 'Items', url: '/items' }
$: thisItemBreadcrumb = { name: itemName || 'This item', url: `/items/${itemId}` }
$: breadcrumbLinks = [itemsBreadcrumb, thisItemBreadcrumb]

const setPolicyHouseholdId = () => householdId = policy.household_id || ''

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
}

</style>
<Page layout={'grid'}>
  {#if !item.id } 
    {#if $loading}
      Loading...
    {:else}
      We could not find that item. Please <a href="/items">go back</a> and select
      an item from the list.
    {/if}
  {:else}
    <Row cols="12">
      <div class="flex justify-between align-items-center" >
        <Breadcrumb links={breadcrumbLinks} />
        <div>
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a on:click={goToDelete} class="delete-button mx-5px" href="">Remove</a>
          <Button on:click={goToEditItem} >Edit Item</Button>
        </div>
      </div>
    </Row>
    
    <Row cols={'3'}>
      <h2>{item.name || ''}</h2>
      <b>Covered value</b>
      <div>{formatMoney(item.coverage_amount)}</div>
      <b>Annual premium</b>
      <div>{formatMoney(item.annual_premium)}</div>
      <br/>
      <b>{item.accountable_person || ''}</b>
      <div>Household ID</div>
      <div>{householdId}</div>
    </Row>
    
    <Row cols={'9'}>
      <ClaimBanner claimStatus={item.coverage_status}>Submitted {daysAgo} days ago</ClaimBanner>
      <h3>{item.make || ''} {item.model || ''}</h3>
      <b class="mb-6px">Unique ID</b>
      <div>{item.serial_number}</div>
      <br/>
      <div>Description: {item.description || ''}</div>
      <br/>
      <Banner background="var(--mdc-theme-primary-header-bg)" color="var(--mdc-theme-primary)" class="max-content-width">{item.category?.name || ''}</Banner>
      <div class="my-1">
        <b>Starts</b>
        <div>{startDate}</div>
      </div>
      <br />
      <div>
        <Button class="mdc-theme--secondary-background" on:click={goToNewClaim} raised>File Claim</Button>
      </div>
    </Row>
  {/if}
</Page>
