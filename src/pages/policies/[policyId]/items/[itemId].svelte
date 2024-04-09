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
import { formatPageTitle } from 'helpers/pageTitle'
import { items as itemsRoute, itemDetails, itemEdit, itemNewClaim, POLICIES, policyDetails } from 'helpers/routes'
import { goto, metatags, redirect } from '@roxi/routify'
import { Button, Page, Dialog, TextArea, setNotice } from '@silintl/ui-components'
import { onMount } from 'svelte'
import { roleSelection, selectedPolicyId } from 'data/role-policy-selection'

export let itemId: string
export let policyId = $selectedPolicyId

onMount(() => {
  loadItems(policyId)
  loadPolicy(policyId)
})

let deleteDialogOpen = false
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

$: policy = $policies.find((policy) => policy.id === policyId) || ({} as Policy)

$: allowRemoveCoverage = (![ItemCoverageStatus.Inactive, ItemCoverageStatus.Denied].includes(status) &&
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
  deleteDialogOpen = false
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
    <header>
      <div class="flex justify-between align-items-center">
        <Breadcrumb links={breadcrumbLinks} />
      </div>
      <h1>Item Details</h1>
    </header>

    <ItemDetails {item} {policyId} {isAdmin}>
      <span slot="headerButtonGroup">
        <ItemDeleteModal open={deleteDialogOpen} {item} on:closed={handleRemoveDialog} />
        {#if allowRemoveCoverage}
          <Button class="remove-button mx-5px" on:click={() => (deleteDialogOpen = true)}>Remove</Button>
        {/if}
        {#if canEdit}
          <Button on:click={goToEditItem}>Edit Item</Button>
        {/if}
      </span>
    </ItemDetails>

    <br />
    <div class="tw-flex tw-justify-between tw-m-4">
      {#if status === ItemCoverageStatus.Approved && isMemberOfPolicy}
      <div>
        <Button class="mdc-theme--secondary-background" on:click={goToNewClaim} raised>File Claim</Button>
      </div>
      {:else if status === ItemCoverageStatus.Pending && isAdmin}
      <div>
        <Button class="mdc-theme--secondary-background" on:click={onDenyItem} raised>Deny Item Coverage</Button>
        <Button class="mdc-theme--primary-variant tw-mx-4" on:click={onReviseItem} raised>Ask for Changes</Button>
        <Button class="mdc-theme--primary-background" on:click={onApproveItem} raised>Approve Item Coverage</Button>
      </div>
      {/if}
      <Button on:click={() => $goto(itemsRoute(policyId))} outlined>Back to Items</Button>
    </div>

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
          class="admin-message-text-area"
          {maxlength}
          rows="4"
          placeholder="A message is required to deny coverage or ask for changes"
          bind:value={denyDialogMessage}
        />
      </p>
    </Dialog.Alert>
  {/if}
</Page>
