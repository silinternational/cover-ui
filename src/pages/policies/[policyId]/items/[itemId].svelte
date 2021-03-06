<script lang="ts">
import user, { UserAppRole } from 'data/user'
import { Breadcrumb, ItemDeleteModal, ItemDetails } from 'components'
import { MAX_TEXT_AREA_LENGTH as maxlength } from 'components/const'
import { loading } from 'components/progress'
import {
  approveItem,
  deleteItem,
  denyItem,
  editableCoverageStatuses,
  ItemCoverageStatus,
  loadItems,
  PolicyItem,
  reviseItem,
  selectedPolicyItems,
} from 'data/items'
import { getNameOfPolicy, loadPolicy, memberBelongsToPolicy, policies, Policy } from 'data/policies'
import { loadPolicyItemHistory, policyHistoryByItemId } from 'data/policy-history'
import { formatDate } from 'helpers/dates'
import { formatPageTitle } from 'helpers/pageTitle'
import { items as itemsRoute, itemDetails, itemEdit, itemNewClaim, POLICIES, policyDetails } from 'helpers/routes'
import { goto, metatags, redirect } from '@roxi/routify'
import { Button, Page, Datatable, Dialog, TextArea, setNotice } from '@silintl/ui-components'
import { onMount } from 'svelte'
import { roleSelection, selectedPolicyId } from 'data/role-policy-selection'

export let itemId: string
export let policyId = $selectedPolicyId

onMount(() => {
  loadItems(policyId)
  loadPolicy(policyId)
})

let deleteDialgoOpen = false
let denyDialogOpen = false
let denyDialogButtons: Dialog.AlertButton[] = []
let denyDialogMessage: string

$: isAdmin = $roleSelection !== UserAppRole.Customer

$: items = $selectedPolicyItems
$: item = items.find((itm) => itm.id === itemId) || ({} as PolicyItem)
$: itemName = item.name || ''
$: status = (item.coverage_status || '') as ItemCoverageStatus
$: isMemberOfPolicy = memberBelongsToPolicy($user.id, $policies, item.policy_id)
$: status === ItemCoverageStatus.Draft && isMemberOfPolicy && editItemRedirect()

$: policyId && item.id && loadPolicyItemHistory(policyId, item.id)
$: policy = $policies.find((policy) => policy.id === policyId) || ({} as Policy)
$: policyItemHistory = $policyHistoryByItemId[item.id]
$: hasHistory = policyItemHistory && policyItemHistory.length > 0

$: allowRemoveCovereage = (![ItemCoverageStatus.Inactive, ItemCoverageStatus.Denied].includes(status) &&
  isMemberOfPolicy) as boolean
$: canEdit = editableCoverageStatuses.includes(status) && isMemberOfPolicy

// Dynamic breadcrumbs data:
$: policyName = getNameOfPolicy(policy)
$: adminBreadcrumbs = isAdmin
  ? [
      { name: 'Policies', url: POLICIES },
      { name: policyName, url: policyDetails(policyId) },
    ]
  : []
const itemsBreadcrumb = { name: 'Items', url: itemsRoute(policyId), icon: 'beach_access' }
$: thisItemBreadcrumb = { name: itemName || 'This item', url: itemDetails(policyId, itemId) }
$: breadcrumbLinks = [...adminBreadcrumbs, itemsBreadcrumb, thisItemBreadcrumb]
$: itemName && (metatags.title = formatPageTitle(`Items > ${itemName}`))

const editItemRedirect = () => {
  $redirect(itemEdit(policyId, itemId))
}

const goToEditItem = () => {
  $goto(itemEdit(policyId, itemId))
}

const goToNewClaim = () => {
  $goto(itemNewClaim(policyId, itemId))
}

const handleRemoveDialog = async (event: CustomEvent<string>) => {
  deleteDialgoOpen = false
  if (event.detail === 'remove') {
    await deleteItem(policyId, itemId)

    $goto(itemsRoute(policyId))
  }
}

const handleDenyDialog = async (event: CustomEvent<string>) => {
  denyDialogOpen = false

  if ((event.detail === 'deny' || event.detail === 'revise') && !denyDialogMessage) {
    setNotice('A message is required')
  } else {
    if (event.detail === 'deny') {
      denyItem(itemId, denyDialogMessage)
    } else if (event.detail === 'revise') {
      reviseItem(itemId, denyDialogMessage)
    }
  }
}

const onApproveItem = async () => {
  await approveItem(itemId)
}

const onDenyItem = () => {
  denyDialogButtons = [
    { label: 'Deny Coverage', action: 'deny', class: 'error-button' },
    { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
  ]
  denyDialogOpen = true
}

const onReviseItem = () => {
  denyDialogButtons = [
    { label: 'Ask for Changes', action: 'revise', class: 'error-button' },
    { label: 'cancel', action: 'cancel', class: 'mdc-dialog__button' },
  ]
  denyDialogOpen = true
}
</script>

<style>
.message-box {
  width: 500px;
  height: 128x;
}
</style>

<Page>
  {#if !item.id}
    {#if $loading}
      Loading...
    {:else}
      We could not find that item. Please <a href={itemsRoute(policyId)}>go back</a> and select an item from the list.
    {/if}
  {:else}
    <div class="flex justify-between align-items-center">
      <Breadcrumb links={breadcrumbLinks} />
      <div>
        {#if allowRemoveCovereage}
          <Button class="remove-button mx-5px" on:click={() => (deleteDialgoOpen = true)}>Remove</Button>
        {/if}
        {#if canEdit}
          <Button on:click={goToEditItem}>Edit Item</Button>
        {/if}
      </div>
    </div>

    <ItemDeleteModal open={deleteDialgoOpen} {item} on:closed={handleRemoveDialog} />
    <ItemDetails {item} {policyId} {isAdmin} />

    <br />
    {#if status === ItemCoverageStatus.Approved && isMemberOfPolicy}
      <div class="m-1">
        <Button class="mdc-theme--secondary-background" on:click={goToNewClaim} raised>File Claim</Button>
      </div>
    {:else if status === ItemCoverageStatus.Pending && isAdmin}
      <div>
        <Button class="mdc-theme--secondary-background" on:click={onDenyItem} raised>Deny Item Coverage</Button>
        <Button class="m-1 mdc-theme--primary-variant" on:click={onReviseItem} raised>Ask for Changes</Button>
        <Button class="mdc-theme--primary-background" on:click={onApproveItem} raised>Approve Item Coverage</Button>
      </div>
    {/if}

    {#if 0 && hasHistory}
      <h3>History</h3>
      <Datatable>
        <Datatable.Header>
          <Datatable.Header.Item>Person</Datatable.Header.Item>
          <Datatable.Header.Item>Action</Datatable.Header.Item>
          <Datatable.Header.Item>Date</Datatable.Header.Item>
        </Datatable.Header>
        <Datatable.Data>
          {#each policyItemHistory as itemHistory}
            <Datatable.Data.Row>
              <Datatable.Data.Row.Item>{itemHistory.user_id}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item
                >{itemHistory.action}
                {itemHistory.field_name} from '{itemHistory.old_value}' to '{itemHistory.new_value}'</Datatable.Data.Row.Item
              >
              <Datatable.Data.Row.Item>{formatDate(itemHistory.updated_at)}</Datatable.Data.Row.Item>
            </Datatable.Data.Row>
          {/each}
        </Datatable.Data>
      </Datatable>
    {/if}

    <Dialog.Alert
      open={denyDialogOpen}
      buttons={denyDialogButtons}
      defaultAction="cancel"
      title="Send a message"
      on:chosen={handleDenyDialog}
      on:closed={handleDenyDialog}
    >
      <p class="message-box">
        <TextArea
          {maxlength}
          style="width: 300px"
          rows="4"
          placeholder="A message is required to deny coverage or ask for changes"
          bind:value={denyDialogMessage}
        />
      </p>
    </Dialog.Alert>
  {/if}
</Page>
