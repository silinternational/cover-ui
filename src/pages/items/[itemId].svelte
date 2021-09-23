<script lang="ts">
import user from '../../authn/user'
import { Banner, Breadcrumb, ItemBanner, Row } from '../../components'
import { day } from '../../components/const'
import { formatDate } from '../../components/dates'
import { loading } from '../../components/progress'
import { ItemCoverageStatus, itemsByPolicyId, loadItems, PolicyItem } from '../../data/items'
import { init, policies, Policy } from '../../data/policies'
import { formatMoney } from '../../helpers/money'
import { goto } from '@roxi/routify'
import { Button, Page, Dialog } from '@silintl/ui-components'

export let itemId: string

const now = Date.now()

let householdId = ''
let open: boolean = false

$: $user.policy_id && loadItems($user.policy_id)

$: $policies.length || init()
$: policyId = $user.policy_id
$: policy = $policies.find((policy) => policy.id === policyId) || ({} as Policy)
$: policy.household_id && setPolicyHouseholdId()

$: items = $itemsByPolicyId[$user.policy_id] || []
$: item = items.find((itm) => itm.id === itemId) || ({} as PolicyItem)
$: itemName = item.name || ''
$: status = (item.coverage_status || '') as ItemCoverageStatus

$: msAgo = now - Date.parse(item.updated_at)
$: daysAgo = msAgo > 0 ? Math.floor(msAgo / day) : '-'
$: startDate = formatDate(item.coverage_start_date)

// Dynamic breadcrumbs data:
const itemsBreadcrumb = { name: 'Items', url: '/items' }
$: thisItemBreadcrumb = { name: itemName || 'This item', url: `/items/${itemId}` }
$: breadcrumbLinks = [itemsBreadcrumb, thisItemBreadcrumb]

const setPolicyHouseholdId = () => (householdId = policy.household_id || '')

const goToEditItem = () => {
  $goto(`/items/${itemId}/edit`)
}
const goToNewClaim = () => {
  $goto(`/items/${itemId}/new-claim`)
}
</script>

<Page layout={'grid'}>
  {#if !item.id}
    {#if $loading}
      Loading...
    {:else}
      We could not find that item. Please <a href="/items">go back</a> and select an item from the list.
    {/if}
  {:else}
    <Row cols="12">
      <div class="flex justify-between align-items-center">
        <Breadcrumb links={breadcrumbLinks} />
        <div>
          <Button class="remove-button mx-5px" on:click={() => (open = true)}>Remove</Button>
          <Dialog.Alert
            {open}
            title="Remove Coverage"
            on:chosen={() => (open = false)}
            on:closed={() => (open = false)}
          />
          {#if status === 'Draft' || status === 'Pending'}
            <Button on:click={goToEditItem}>Edit Item</Button>
          {/if}
        </div>
      </div>
    </Row>

    <Row cols="3">
      <h2>{item.name || ''}</h2>
      <b>Covered value</b>
      <div>{formatMoney(item.coverage_amount)}</div>
      <b>Annual premium</b>
      <div>{formatMoney(item.annual_premium)}</div>
      <br />
      <b>{item.accountable_person || ''}</b>
      <div>Household ID</div>
      <div>{householdId}</div>
    </Row>

    <Row cols="9">
      <ItemBanner itemStatus={status}>Submitted {daysAgo} days ago</ItemBanner>
      <h3>{item.make || ''} {item.model || ''}</h3>
      <b class="mb-6px">Unique ID</b>
      <div>{item.serial_number}</div>
      <br />
      <div>Description: {item.description || ''}</div>
      <br />
      <Banner
        background="var(--mdc-theme-primary-header-bg)"
        color="var(--mdc-theme-primary)"
        class="max-content-width"
      >
        {item.category?.name || ''}
      </Banner>
      <div class="my-1">
        <b>Starts</b>
        <div>{startDate}</div>
      </div>
      <br />
      <div>
        {#if status === 'Approved'}
          <Button class="mdc-theme--secondary-background" on:click={goToNewClaim} raised>File Claim</Button>
        {/if}
      </div>
    </Row>
  {/if}
</Page>
