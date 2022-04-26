<script lang="ts">
import BatchItemDelete from '../../components/BatchItemDelete.svelte'
import DatatableCheckbox from './DatatableCheckbox.svelte'
import DatatableCheckboxHeader from './DatatableCheckboxHeader.svelte'
import { AccountablePerson, editableCoverageStatuses, ItemCoverageStatus, PolicyItem } from 'data/items'
import { formatDate, formatFriendlyDate } from 'helpers/dates'
import { formatMoney } from 'helpers/money'
import { itemDetails, itemEdit } from 'helpers/routes'
import { sortByNum, sortByString } from 'helpers/sort'
import ItemDeleteModal from '../ItemDeleteModal.svelte'
import { createEventDispatcher } from 'svelte'
import { Datatable, Menu, MenuItem } from '@silintl/ui-components'
import { getItemState } from 'data/states'

type Column = {
  title: string
  headerId: string
  numeric?: boolean
  path: string
  sortable?: boolean
}

export let items = [] as PolicyItem[]
export let policyId: string
export let title: string = ''
export let batchActionDisabled = true

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

let headerId = 'name'
let ascending = true
let currentColumn = columns[0]

let currentItem = {} as PolicyItem
let goToItemDetails = true
let modalOpen = false
let shownMenus: { [name: string]: boolean } = {}

$: sortedItemsArray = currentColumn.numeric
  ? sortByNum(currentColumn.path, items, ascending)
  : sortByString(currentColumn.path, items, ascending)

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
  modalOpen = true
}

const handleModalDialog = async (event: CustomEvent<string>) => {
  modalOpen = false
  if (event.detail === 'remove') {
    dispatch('delete', currentItem.id)
  }
}

const handleChange = (itemId: string) => {
  dispatch('change', itemId)
}

const handleClosed = (e: CustomEvent) => {
  if (e.detail === 'delete') {
    dispatch('batchDelete')
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

<BatchItemDelete disabled={batchActionDisabled} on:closed={handleClosed} />

{#if title}
  <h3>{title}</h3>
{/if}
<Datatable on:sorted={onSorted}>
  <Datatable.Header>
    <!-- TODO: programmatically check which boxes are ticked using getSelectedRowIds() in ui-components using DatatableHeader -->
    <DatatableCheckboxHeader />
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
        <DatatableCheckbox
          disabled={item.coverage_end_date}
          on:click={() => (goToItemDetails = false)}
          on:change={() => handleChange(item.id)}
        />
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
<ItemDeleteModal open={modalOpen} item={currentItem} on:closed={handleModalDialog} />
