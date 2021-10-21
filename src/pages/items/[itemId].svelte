<script lang="ts">
import user from '../../authn/user'
import { Banner, Breadcrumb, ItemBanner, ItemDeleteModal, Row } from 'components'
import { getYear, formatDate } from 'components/dates'
import { loading } from 'components/progress'
import {
  AccountablePersonOptions,
  getAccountablePerson,
  getDependentOptions,
  getPolicyMemberOptions,
} from 'data/accountablePersons'
import { dependentsByPolicyId, loadDependents } from 'data/dependents'
import { deleteItem, ItemCoverageStatus, itemsByPolicyId, loadItems, PolicyItem } from 'data/items'
import { paymentReceivedByYearByPolicyId } from 'data/payment'
import { init, policies, Policy } from 'data/policies'
import { loadMembersOfPolicy, membersByPolicyId } from 'data/policy-members'
import { formatMoney } from 'helpers/money'
import { ITEMS, item as itemRoute, itemEdit, itemNewClaim, CUSTOMER_HOME } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Button, Page, Dialog } from '@silintl/ui-components'
import { formatDistanceToNow } from 'date-fns'

export let itemId: string

const buttons: Dialog.AlertButton[] = [
  { label: 'Yes, I’m Sure', action: 'remove', class: 'error-button' },
  { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
]

let householdId = ''
let open: boolean = false
let accountablePersons: AccountablePersonOptions[]

$: $user.policy_id && loadItems($user.policy_id)

$: $policies.length || init()
$: policyId = $user.policy_id as string

// Accountable persons
$: policyId && loadDependents(policyId)
$: dependents = $dependentsByPolicyId[policyId] || []
$: dependentOptions = getDependentOptions(dependents)

$: policyId && loadMembersOfPolicy(policyId)
$: policyMembers = $membersByPolicyId[policyId] || []
$: policyMemberOptions = getPolicyMemberOptions(policyMembers)

$: accountablePersons = [...policyMemberOptions, ...dependentOptions]
$: accountablePersonName = getAccountablePerson(item, accountablePersons)?.name

$: policy = $policies.find((policy) => policy.id === policyId) || ({} as Policy)
$: householdId = policy.household_id ? policy.household_id : ''
$: items = $itemsByPolicyId[$user.policy_id] || []
$: item = items.find((itm) => itm.id === itemId) || ({} as PolicyItem)
$: itemName = item.name || ''
$: status = (item.coverage_status || '') as ItemCoverageStatus
$: status === 'Draft' && $user.app_role === 'User' && goToEditItem()
$: hasPaid = $paymentReceivedByYearByPolicyId[policyId]?.[year]
$: unpaid = !hasPaid
$: org = policy?.entity_code?.name

$: submittedText = item.updated_at ? formatDistanceToNow(Date.parse(item.updated_at), { addSuffix: true }) : ''
$: startDate = formatDate(item.coverage_start_date)
$: year = getYear(startDate)
$: renewYear = Number(year) + 1

$: allowRemoveCovereage = !['Inactive', 'Denied'].includes(status) as boolean

// Dynamic breadcrumbs data:
const itemsBreadcrumb = { name: 'Items', url: ITEMS }
$: thisItemBreadcrumb = { name: itemName || 'This item', url: itemRoute(itemId) }
$: breadcrumbLinks = [itemsBreadcrumb, thisItemBreadcrumb]
$: itemName && (metatags.title = formatPageTitle(`Items > ${itemName}`))

const goToEditItem = () => {
  $goto(itemEdit(itemId))
}
const goToNewClaim = () => {
  $goto(itemNewClaim(itemId))
}

const handleDialog = async (event: CustomEvent<string>) => {
  open = false
  if (event.detail === 'remove') {
    await deleteItem(policyId, itemId)

    $goto(ITEMS)
  }
}

const onPayment = () => {
  $paymentReceivedByYearByPolicyId[policyId] = { [year]: true }

  console.log('sending payment') //TODO call endpoint when ready
}
</script>

<style>
.payment-header {
  background-color: var(--mdc-theme-neutral-bg);
  padding: 4px;
  border-radius: 8px 8px 0 0;
}

.unpaid {
  background-color: var(--mdc-theme-neutral-9);
  border-radius: 0 0 8px 8px;
}
</style>

<Page>
  {#if !item.id}
    {#if $loading}
      Loading...
    {:else}
      We could not find that item. Please <a href={ITEMS}>go back</a> and select an item from the list.
    {/if}
  {:else}
    {#if hasPaid}
      <div class="flex justify-between align-items-center">
        <Breadcrumb links={breadcrumbLinks} />
        <div>
          {#if allowRemoveCovereage}
            <Button class="remove-button mx-5px" on:click={() => (open = true)}>Remove</Button>
          {/if}
          {#if status === 'Draft' || status === 'Pending'}
            <Button on:click={goToEditItem}>Edit Item</Button>
          {/if}
        </div>
      </div>
    {:else}
      <h2>Review Coverage and Checkout</h2>
      <div class="payment-header flex justify-between align-items-center">
        <Button class="mx-5px" on:click={() => (open = true)}>Discard</Button>
        <div>
          <Button outlined on:click={$goto(CUSTOMER_HOME)}>Save for later</Button>
          <Button raised on:click={goToEditItem}>Edit Item</Button>
        </div>
      </div>
    {/if}
    <ItemDeleteModal {open} {item} on:closed={handleDialog} />
    <div class="flex p-1" class:unpaid>
      <div class="w-25">
        <h2 class="break-word my-1">{item.name || ''}</h2>
        <b>Covered value</b>
        <div class="my-2px">{formatMoney(item.coverage_amount)}</div>
        <b>Annual premium</b>
        <div class="my-2px">{formatMoney(item.annual_premium)}</div>
        <br />
        <b>{accountablePersonName || ''}</b>
        <div class="mt-4px">Household ID</div>
        <div>{householdId}</div>
      </div>

      <div class="w-75">
        {#if hasPaid}
          <ItemBanner itemStatus={status}>Submitted {submittedText}</ItemBanner>
        {/if}
        <h3 class="break-word">{item.make || ''} {item.model || ''}</h3>
        {#if item.serial_number}
          <b class="mb-6px">Unique ID</b>
          <div class="break-word">{item.serial_number}</div>
          <br />
        {/if}
        <div class="break-word">Description: {item.description || ''}</div>
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
          {#if hasPaid}
            {#if status === 'Approved'}
              <Button class="mdc-theme--secondary-background" on:click={goToNewClaim} raised>File Claim</Button>
            {/if}
          {/if}
        </div>
      </div>
    </div>
    {#if !hasPaid}
      <div class="flex p-1 mt-2">
        <div>
          Pay {formatMoney(item.annual_premium)} for the remainder of {year} from {org} account {householdId}.
          Auto-renew on 1 January {renewYear}.
        </div>
        <Button class="ml-1" raised on:click={onPayment}>Agree and Pay {formatMoney(item.annual_premium)}</Button>
      </div>
    {/if}
  {/if}
</Page>
