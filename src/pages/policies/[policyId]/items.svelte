<script lang="ts">
import { ClaimCards, Row, ItemDeleteModal } from 'components'
import { isLoadingById } from 'components/progress'
import { formatDate } from 'components/dates'
import { claims, loadClaims } from 'data/claims'
import {
  AccountablePersonOptions,
  getAccountablePerson,
  getDependentOptions,
  getPolicyMemberOptions,
} from 'data/accountablePersons'
import { dependentsByPolicyId, loadDependents } from 'data/dependents'
import { deleteItem, itemsByPolicyId, loadItems, PolicyItem } from 'data/items'
import { loadMembersOfPolicy, membersByPolicyId } from 'data/policy-members'
import { formatMoney } from 'helpers/money'
import * as routes from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Page, Datatable, Menu, MenuItem } from '@silintl/ui-components'

export let policyId: string

let goToItemDetails = true
let shownMenus: { [name: string]: boolean } = {}
let modalOpen = false
let currentItem = {} as PolicyItem

$: policyId && loadItems(policyId)
$: items = $itemsByPolicyId[policyId] || []

$: policyId && loadClaims()

$: policyId && loadDependents(policyId)
$: dependents = $dependentsByPolicyId[policyId] || []
$: dependentOptions = getDependentOptions(dependents)

$: policyId && loadMembersOfPolicy(policyId)
$: policyMembers = $membersByPolicyId[policyId] || []
$: policyMemberOptions = getPolicyMemberOptions(policyMembers)
$: accountablePersons = [...policyMemberOptions, ...dependentOptions] as AccountablePersonOptions[]
$: metatags.title = formatPageTitle('Home')

const getMenuItems = (item: PolicyItem) => {
  const menuItems: MenuItem[] = [
    {
      label: 'View Details',
      url: routes.itemDetails(policyId, item.id),
    },
    {
      label: 'Edit',
      url: routes.itemEdit(policyId, item.id),
    },
  ]
  if (item.coverage_status != 'Inactive') {
    menuItems.push({
      label: item.coverage_status === 'Draft' ? 'Delete' : 'Remove Coverage',
      action: handleDeleteClick,
    })
  }
  return menuItems
}

const handleDeleteClick = () => {
  goToItemDetails = false
  modalOpen = true
}

const handleModalDialog = async (event: CustomEvent<string>) => {
  modalOpen = false
  if (event.detail === 'remove') {
    await deleteItem(policyId, currentItem.id)

    // Depending on if the item was a draft or approved it will either be deleted or updated
    // Just reload the list for now since the delete endpoint doesn't yet tell us what happened
    await loadItems(policyId)
  }
}

const getStatusClass = (status: string) => (status === 'Draft' ? 'mdc-theme--primary mdc-bold-font' : '')

// TODO: Change this to dispatch events, leaving URL changes to the actual page.
const redirect = (item: PolicyItem) => {
  currentItem = item

  if (goToItemDetails) {
    let url = routes.itemDetails(policyId, item.id)
    $goto(url)
  } else {
    goToItemDetails = true
  }
}

const handleMoreVertClick = (id: string) => {
  goToItemDetails = false
  shownMenus[id] = shownMenus[id] !== true
}
const onGotoClaim = (event: CustomEvent) => $goto(routes.customerClaimDetails(policyId, event.detail))
</script>

<style>
/* TODO: make this more accurate when design is finialized */

.home-table-more-vert {
  width: 30px;
  height: 30px;
  margin-top: 12px;
  color: #858c94;
  cursor: pointer;
}

.home-table-more-vert:hover {
  color: #6e7377;
}

.item-menu {
  position: absolute;
  right: 235px;
}
</style>

<Page layout="grid">
  <Row cols={'12'}>
    <ClaimCards claims={$claims} {items} {accountablePersons} on:goto-claim={onGotoClaim} />
  </Row>

  <Row cols={'12'}>
    {#if isLoadingById(policyId)}
      Loading items...
    {:else}
      <Datatable>
        <Datatable.Header>
          <!--TODO: make the amount of columns shown be dependent on the device size-->
          <Datatable.Header.Item />
          <Datatable.Header.Item>Item</Datatable.Header.Item>
          <Datatable.Header.Item>Status</Datatable.Header.Item>
          <Datatable.Header.Item>Accountable Person</Datatable.Header.Item>
          <Datatable.Header.Item>Cost</Datatable.Header.Item>
          <Datatable.Header.Item>Premium</Datatable.Header.Item>
          <Datatable.Header.Item>Recent Activity</Datatable.Header.Item>
        </Datatable.Header>
        <Datatable.Data>
          {#each items as item (item.id)}
            <Datatable.Data.Row on:click={() => redirect(item)} clickable>
              <Datatable.Data.Row.Item />
              <Datatable.Data.Row.Item>{item.name || ''}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item class={getStatusClass(item.coverage_status)}
                >{item.coverage_status || ''}</Datatable.Data.Row.Item
              >
              <Datatable.Data.Row.Item
                >{getAccountablePerson(item, accountablePersons).name || ''}</Datatable.Data.Row.Item
              >
              <Datatable.Data.Row.Item>{formatMoney(item.coverage_amount)}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>{formatMoney(item.annual_premium)}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>{formatDate(item.updated_at)}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>
                <svg class="home-table-more-vert" viewBox="0 0 30 30" on:click={() => handleMoreVertClick(item.id)}>
                  <path
                    fill="currentColor"
                    d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"
                  />
                </svg>
                <!--TODO FUTURE: make this show above the more vert icon when it is in the lower half of the page-->
                <div class="item-menu">
                  <Menu bind:menuOpen={shownMenus[item.id]} menuItems={getMenuItems(item)} />
                </div>
              </Datatable.Data.Row.Item>
            </Datatable.Data.Row>
          {/each}
        </Datatable.Data>
      </Datatable>
      <ItemDeleteModal open={modalOpen} item={currentItem} on:closed={handleModalDialog} />
    {/if}
  </Row>
</Page>