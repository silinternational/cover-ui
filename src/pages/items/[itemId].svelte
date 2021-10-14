<script lang="ts">
import user from '../../authn/user'
import { Banner, Breadcrumb, ItemBanner, Row } from 'components'
import { formatDate } from 'components/dates'
import { loading } from 'components/progress'
import {
  AccountablePersonOptions,
  getAccountablePerson,
  getDependentOptions,
  getPolicyMemberOptions,
} from 'data/accountablePersons'
import { dependentsByPolicyId, loadDependents } from 'data/dependents'
import { deleteItem, ItemCoverageStatus, itemsByPolicyId, loadItems, PolicyItem } from 'data/items'
import { init, policies, Policy } from 'data/policies'
import { loadMembersOfPolicy, membersByPolicyId } from 'data/policy-members'
import { formatMoney } from 'helpers/money'
import { ITEMS, item as itemRoute, itemEdit, itemNewClaim } from 'helpers/routes'
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

$: submittedText = item.updated_at ? formatDistanceToNow(Date.parse(item.updated_at), { addSuffix: true }) : ''
$: startDate = formatDate(item.coverage_start_date)

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

const handleDialog = async (choice: string) => {
  open = false

  if (choice === 'remove') {
    await deleteItem(policyId, itemId)

    $goto(ITEMS)
  }
}
</script>

<Page layout={'grid'}>
  {#if !item.id}
    {#if $loading}
      Loading...
    {:else}
      We could not find that item. Please <a href={ITEMS}>go back</a> and select an item from the list.
    {/if}
  {:else}
    <Row cols="12">
      <div class="flex justify-between align-items-center">
        <Breadcrumb links={breadcrumbLinks} />
        <div>
          {#if allowRemoveCovereage}
            <Button class="remove-button mx-5px" on:click={() => (open = true)}>Remove</Button>
          {/if}
          <Dialog.Alert
            {open}
            {buttons}
            defaultAction="cancel"
            title="Remove Coverage"
            on:chosen={(e) => handleDialog(e.detail)}
            on:closed={handleDialog}>Are you sure you would like to remove coverage for {itemName}?</Dialog.Alert
          >
          {#if status === 'Draft' || status === 'Pending'}
            <Button on:click={goToEditItem}>Edit Item</Button>
          {/if}
        </div>
      </div>
    </Row>

    <Row cols="3">
      <h2 class="break-word my-1">{item.name || ''}</h2>
      <b>Covered value</b>
      <div class="my-2px">{formatMoney(item.coverage_amount)}</div>
      <b>Annual premium</b>
      <div class="my-2px">{formatMoney(item.annual_premium)}</div>
      <br />
      <b>{accountablePersonName || ''}</b>
      <div class="mt-4px">Household ID</div>
      <div>{householdId}</div>
    </Row>

    <Row cols="9">
      <ItemBanner itemStatus={status}>Submitted {submittedText}</ItemBanner>
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
        {#if status === 'Approved'}
          <Button class="mdc-theme--secondary-background" on:click={goToNewClaim} raised>File Claim</Button>
        {/if}
      </div>
    </Row>
  {/if}
</Page>
