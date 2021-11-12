<script lang="ts">
import ItemDeleteModal from './ItemDeleteModal.svelte'
import { formatDate } from 'components/dates'
import type { PolicyItem } from 'data/items'
import { formatMoney } from 'helpers/money'
import { itemDetails, itemEdit } from 'helpers/routes'
import { createEventDispatcher } from 'svelte'
import { Datatable, Menu, MenuItem } from '@silintl/ui-components'

export let items = [] as PolicyItem[]
export let policyId: string
export let title: string = ''

let currentItem = {} as PolicyItem
let goToItemDetails = true
let modalOpen = false
let shownMenus: { [name: string]: boolean } = {}

const dispatch = createEventDispatcher()

const getMenuItems = (item: PolicyItem) => {
  const menuItems: MenuItem[] = [
    {
      label: 'View Details',
      url: itemDetails(policyId, item.id),
    },
  ]
  if (item.coverage_status !== 'Inactive') {
    menuItems.push({
      label: item.coverage_status === 'Draft' ? 'Delete' : 'Remove Coverage',
      action: handleDeleteClick,
    })
  }
  if (['Draft', 'Pending'].includes(item.coverage_status)) {
    menuItems.push({
      label: 'Edit',
      url: itemEdit(policyId, item.id),
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
    dispatch('delete', currentItem.id)
  }
}

const handleMoreVertClick = (id: string) => {
  goToItemDetails = false
  shownMenus[id] = shownMenus[id] !== true
}

// TODO: Change this to dispatch events, leaving URL changes to the actual page.
const redirectAndSetCurrentItem = (item: PolicyItem) => {
  currentItem = item

  if (goToItemDetails) {
    let url = itemDetails(policyId, item.id)
    dispatch('gotoItem', url)
  } else {
    goToItemDetails = true
  }
}

const getStatusClass = (status: string) => (status === 'Draft' ? 'mdc-theme--primary mdc-bold-font' : '')
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

{#if title}
  <h3>{title}</h3>
{/if}
<Datatable>
  <Datatable.Header>
    <!--TODO: make the amount of columns shown be dependent on the device size-->
    <Datatable.Header.Item>Item</Datatable.Header.Item>
    <Datatable.Header.Item>Status</Datatable.Header.Item>
    <Datatable.Header.Item>Accountable Person</Datatable.Header.Item>
    <Datatable.Header.Item numeric>Covered Value</Datatable.Header.Item>
    <Datatable.Header.Item numeric>Premium</Datatable.Header.Item>
    <Datatable.Header.Item>Recent Activity</Datatable.Header.Item>
  </Datatable.Header>
  <Datatable.Data>
    {#each items as item (item.id)}
      <Datatable.Data.Row on:click={() => redirectAndSetCurrentItem(item)} clickable>
        <Datatable.Data.Row.Item>{item.name || ''}</Datatable.Data.Row.Item>
        <Datatable.Data.Row.Item class={getStatusClass(item.coverage_status)}
          >{item.coverage_status || ''}</Datatable.Data.Row.Item
        >
        <Datatable.Data.Row.Item>{item.accountable_person?.name || ''}</Datatable.Data.Row.Item>
        <Datatable.Data.Row.Item numeric>{formatMoney(item.coverage_amount)}</Datatable.Data.Row.Item>
        <Datatable.Data.Row.Item numeric>{formatMoney(item.annual_premium)}</Datatable.Data.Row.Item>
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
