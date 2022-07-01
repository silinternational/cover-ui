<script lang="ts">
import BatchItemClone from '../BatchItemClone.svelte'
import BatchItemDelete from '../BatchItemDelete.svelte'
import { getItemState } from 'data/states'
import { AccountablePerson, editableCoverageStatuses, ItemCoverageStatus, PolicyItem } from 'data/items'
import { formatDate, formatFriendlyDate } from 'helpers/dates'
import { formatMoney } from 'helpers/money'
import { itemDetails, itemEdit } from 'helpers/routes'
import { sortByNum, sortByString } from 'helpers/sort'
import ItemDeleteModal from '../ItemDeleteModal.svelte'
import type { Column } from './types'
import { createEventDispatcher } from 'svelte'
import { Datatable, Menu, MenuItem } from '@silintl/ui-components'

export let items = [] as PolicyItem[]
export let policyId: string
export let title: string = ''

const columns: Column[] = [
  {
    title: 'Item',
    headerId: 'item',
    path: 'name',
    sortable: true,
  },
  {
    title: 'Status',
    headerId: 'status',
    path: 'coverage_status',
    sortable: true,
  },
  {
    title: 'Assigned To',
    headerId: 'assigned_to',
    path: 'accountable_person.name',
    sortable: true,
  },
  {
    title: 'Location',
    headerId: 'location',
    path: 'accountable_person.country',
    sortable: true,
  },
  {
    title: 'Covered Value',
    headerId: 'covered_value',
    numeric: true,
    path: 'coverage_amount',
    sortable: true,
  },
  {
    title: 'Premium',
    headerId: 'premium',
    numeric: true,
    path: 'prorated_annual_premium',
    sortable: true,
  },
  {
    title: 'Recent Activity',
    headerId: 'recent_activity',
    path: 'updated_at',
    sortable: true,
  },
]

let checkboxIsMountedArray = [] as boolean[]
let headerId = 'name'
let ascending = true
let currentColumn = columns[0]

let checkedItems = [] as PolicyItem[]
let currentItem = {} as PolicyItem
let goToItemDetails = true
let DeleteModalOpen = false
let shownMenus: { [name: string]: boolean } = {}

$: selectedItemNames = checkedItems.map((item) => item.name)
$: sortedItemsArray = currentColumn.numeric
  ? sortByNum(currentColumn.path, items, ascending)
  : sortByString(currentColumn.path, items, ascending)
$: allCheckedItemsAreDraft =
  checkedItems.length > 0 && checkedItems.every((item) => item.coverage_status === ItemCoverageStatus.Draft)
$: batchActionDisabled = checkedItems.length === 0

const dispatch = createEventDispatcher()

const getMenuItems = (item: PolicyItem) => {
  const menuItems: MenuItem[] = [
    {
      label: 'view item',
      url: itemDetails(policyId, item.id),
    },
  ]
  if (item.coverage_status !== ItemCoverageStatus.Inactive) {
    menuItems.push({
      label: item.coverage_status === ItemCoverageStatus.Draft ? 'delete' : 'end coverage',
      action: handleDeleteClick,
    })
  }
  if (editableCoverageStatuses.includes(item.coverage_status)) {
    menuItems.push({
      label: 'edit item',
      url: itemEdit(policyId, item.id),
    })
  }
  return menuItems
}

const handleDeleteClick = () => {
  goToItemDetails = false
  DeleteModalOpen = true
}

const handleModalDialog = async (event: CustomEvent<string>) => {
  if (event.detail === 'remove') {
    DeleteModalOpen = false
    dispatch('delete', currentItem.id)
  }
}

const handleClosed = (e: CustomEvent<string>) => {
  if (e.detail === 'delete') {
    dispatch('batchDelete', checkedItems)
    checkedItems = []
  }
  if (e.detail === 'clone') {
    dispatch('batchClone', checkedItems)
    checkedItems = []
  }
}

const handleMoreVertClick = (id: string) => {
  goToItemDetails = false
  shownMenus[id] = shownMenus[id] !== true
}

const redirectAndSetCurrentItem = (item: PolicyItem) => {
  currentItem = item

  if (goToItemDetails) {
    let url = itemDetails(policyId, item.id)
    dispatch('gotoItem', url)
  } else {
    goToItemDetails = true
  }
}

const getStatusClass = (status: string) =>
  status === ItemCoverageStatus.Draft ? 'mdc-theme--primary mdc-bold-font' : ''

const setAccountablePersonCountryIfNoneExists = () => {
  if (currentColumn.headerId === 'location') {
    items.forEach((item) => {
      !item.accountable_person && (item.accountable_person = {} as AccountablePerson)
      !item.accountable_person.country && (item.accountable_person.country = item.country || '')
    })
  }
}

const onSorted = (event: CustomEvent) => {
  ascending = event.detail.sortValue === 'ascending'
  headerId = event.detail.columnId || ''
  currentColumn = columns.find((column) => column.headerId === headerId) || columns[0]
  setAccountablePersonCountryIfNoneExists()
}

const onSelectedAll = () => {
  checkedItems = [...items]
}

const onUnSelectedAll = () => {
  checkedItems = []
}

const onRowSelectionChanged = (event: CustomEvent) => {
  const { rowIndex, selected } = event.detail
  if (selected) {
    checkedItems = [...checkedItems, items[rowIndex]]
  } else {
    checkedItems = checkedItems.filter((item) => item.id !== items[rowIndex].id)
  }
}

const registerNewCheckbox = () => (checkboxIsMountedArray = [...checkboxIsMountedArray, true])
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

<BatchItemDelete disabled={batchActionDisabled} {allCheckedItemsAreDraft} on:closed={handleClosed} />

<BatchItemClone disabled={batchActionDisabled} {selectedItemNames} on:closed={handleClosed} />

{#if title}
  <h3>{title}</h3>
{/if}
<Datatable
  {checkboxIsMountedArray}
  on:sorted={onSorted}
  on:selectedAll={onSelectedAll}
  on:unselectedAll={onUnSelectedAll}
  on:rowSelectionChanged={onRowSelectionChanged}
>
  <Datatable.Header>
    <Datatable.Header.Checkbox />
    <!--TODO: make the amount of columns shown be dependent on the device size-->
    {#each columns as column}
      <Datatable.Header.Item numeric={column.numeric} columnID={column.headerId} sortable={column.sortable}>
        {column.title}
      </Datatable.Header.Item>
    {/each}
  </Datatable.Header>
  <Datatable.Data>
    {#each sortedItemsArray as item (item.id)}
      <Datatable.Data.Row on:click={() => redirectAndSetCurrentItem(item)} clickable>
        <Datatable.Checkbox on:click={() => (goToItemDetails = false)} on:mounted={registerNewCheckbox} />
        <Datatable.Data.Row.Item>{item.name || ''}</Datatable.Data.Row.Item>
        <Datatable.Data.Row.Item class={getStatusClass(item.coverage_status)}>
          {#if item.coverage_status === ItemCoverageStatus.Approved && item.coverage_end_date}
            Covered through {formatFriendlyDate(item.coverage_end_date)}
          {:else}
            {getItemState(item.coverage_status)?.title || ''}
          {/if}
        </Datatable.Data.Row.Item>
        <Datatable.Data.Row.Item>{item.accountable_person?.name || ''}</Datatable.Data.Row.Item>
        <Datatable.Data.Row.Item>{item.accountable_person?.country || item.country || ''}</Datatable.Data.Row.Item>
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
<ItemDeleteModal open={DeleteModalOpen} item={currentItem} on:closed={handleModalDialog} />
