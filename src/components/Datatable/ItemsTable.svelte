<script lang="ts">
import BatchItemClone from '../BatchItemClone.svelte'
import BatchItemDelete from '../BatchItemDelete.svelte'
import CopyTableButton from './CopyTableButton.svelte'
import { ClaimItem, incompleteClaimItemStatuses, selectedPolicyClaims } from 'data/claims'
import { getItemState } from 'data/states'
import { AccountablePerson, editableCoverageStatuses, ItemCoverageStatus, PolicyItem } from 'data/items'
import { formatDate, formatFriendlyDate } from 'helpers/dates'
import { throwError } from '../../error'
import { formatMoney } from 'helpers/money'
import { itemDetails, itemEdit } from 'helpers/routes'
import { sortByNum, sortByString } from 'helpers/sort'
import ItemDeleteModal from '../ItemDeleteModal.svelte'
import type { Column } from './types'
import { capitalize } from 'lodash-es'
import { createEventDispatcher } from 'svelte'
import { Checkbox, Datatable, IconButton, Menu, MenuItem } from '@silintl/ui-components'
import { generateRandomID } from '@silintl/ui-components/random'

export let items = [] as PolicyItem[]
export let policyId: string
export let title: string = ''

const columnIndicesToToggle = [1, 2, 3]
const columns: Column[] = [
  {
    title: 'Item',
    headerId: 'item',
    path: 'name',
    sortable: true,
  },
  {
    title: 'Serial Number',
    headerId: 'serial_number',
    path: 'serial_number',
    sortable: true,
    hidden: true,
  },
  {
    title: 'Make',
    headerId: 'Make',
    path: 'Make',
    sortable: true,
    hidden: true,
  },
  {
    title: 'Model',
    headerId: 'model',
    path: 'model',
    sortable: true,
    hidden: true,
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
const uniqueTableClass = generateRandomID('items-table-')

let numberOfCheckboxes = 0
let headerId = 'name'
let ascending = true
let currentColumn = columns[1]

let checkedItems = [] as PolicyItem[]
let currentItem = {} as PolicyItem
let goToItemDetails = true
let deleteModalIsOpen = false
let shownMenus: { [name: string]: boolean } = {}
let snMakeAndModelAreVisible = false

$: selectedItemNames = checkedItems.map((item) => item.name)
$: sortedItemsArray = currentColumn.numeric
  ? sortByNum(currentColumn.path as string, items, ascending)
  : sortByString(currentColumn.path as string, items, ascending)
$: allCheckedItemsAreDraft =
  checkedItems.length > 0 && checkedItems.every((item) => item.coverage_status === ItemCoverageStatus.Draft)
$: batchActionIsDisabled = checkedItems.length === 0
$: batchDeleteIsDisabled =
  batchActionIsDisabled ||
  checkedItems.some((item) => item.coverage_end_date || item.coverage_status === ItemCoverageStatus.Inactive)
$: items && (checkedItems = returnFilteredCheckedItems())

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
  deleteModalIsOpen = true
}

const handleModalDialog = async (event: CustomEvent<string>) => {
  if (event.detail === 'remove') {
    deleteModalIsOpen = false
    dispatch('delete', currentItem.id)
  }
}

const handleClosed = (e: CustomEvent<string>) => {
  if (e.detail === 'delete') {
    assertItemsHaveNoOpenClaims(checkedItems)
    dispatch('batchDelete', checkedItems)
  }
  if (e.detail === 'clone') {
    dispatch('batchClone', checkedItems)
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

const registerNewCheckbox = () => {
  numberOfCheckboxes++
}

const returnFilteredCheckedItems = () => checkedItems.filter((ci) => items.some((i) => i.id === ci.id))

const assertItemsHaveNoOpenClaims = (items: PolicyItem[]): void => {
  const checkClaimItemsForItemAndOpenClaim = (claimItems: ClaimItem[], item: PolicyItem) => {
    const hasOpenClaim = claimItems.some(
      (claimItem) => claimItem.item_id === item.id && incompleteClaimItemStatuses.includes(claimItem.status)
    )
    if (hasOpenClaim) {
      throwError(`${capitalize(item.name)} has an open claim, you cannot end coverage until it is resolved.`)
    }
  }
  $selectedPolicyClaims.forEach((claim) => {
    items.forEach((item) => checkClaimItemsForItemAndOpenClaim(claim.claim_items, item))
  })
}

const toggleShowSnMakeAndModel = () => {
  columnIndicesToToggle.forEach((i) => (columns[i].hidden = !columns[i].hidden))
  snMakeAndModelAreVisible = !snMakeAndModelAreVisible
}
</script>

<style>
.item-menu {
  position: absolute;
  right: 235px;
}

.red {
  color: var(--mdc-theme-status-error);
}
</style>

<BatchItemDelete isDisabled={batchDeleteIsDisabled} {allCheckedItemsAreDraft} on:closed={handleClosed} />

<BatchItemClone isDisabled={batchActionIsDisabled} {selectedItemNames} on:closed={handleClosed} />

<Checkbox class="mb-1" on:checked={toggleShowSnMakeAndModel} on:unchecked={toggleShowSnMakeAndModel} />Show S/N, Make
and Model

{#if title}
  <h3>{title}</h3>
{/if}
<Datatable
  class={uniqueTableClass}
  {numberOfCheckboxes}
  on:sorted={onSorted}
  on:selectedAll={onSelectedAll}
  on:unselectedAll={onUnSelectedAll}
  on:rowSelectionChanged={onRowSelectionChanged}
>
  <Datatable.Header>
    <Datatable.Header.Checkbox />
    <!--TODO: make the amount of columns shown be dependent on the device size-->
    {#each columns as column}
      {#if !column.hidden}
        <Datatable.Header.Item numeric={column.numeric} columnID={column.headerId} sortable={column.sortable}>
          {column.title}
        </Datatable.Header.Item>
      {/if}
    {/each}
  </Datatable.Header>
  <Datatable.Data>
    {#each sortedItemsArray as item (item.id)}
      <Datatable.Data.Row on:click={() => redirectAndSetCurrentItem(item)} let:rowId clickable>
        <Datatable.Checkbox {rowId} on:click={() => (goToItemDetails = false)} on:mounted={registerNewCheckbox} />
        <Datatable.Data.Row.Item>{item.name || ''}</Datatable.Data.Row.Item>
        {#if snMakeAndModelAreVisible}
          <Datatable.Data.Row.Item>{item.serial_number || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{item.make || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{item.model || ''}</Datatable.Data.Row.Item>
        {/if}
        <Datatable.Data.Row.Item class={getStatusClass(item.coverage_status)}>
          {#if item.coverage_status === ItemCoverageStatus.Approved && item.coverage_end_date}
            <div class="red">Covered through {formatFriendlyDate(item.coverage_end_date)}</div>
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
          <IconButton icon="more_vert" on:click={() => handleMoreVertClick(item.id)} />
          <div class="item-menu">
            <Menu bind:menuOpen={shownMenus[item.id]} menuItems={getMenuItems(item)} />
          </div>
        </Datatable.Data.Row.Item>
      </Datatable.Data.Row>
    {/each}
  </Datatable.Data>
</Datatable>

<CopyTableButton {uniqueTableClass} />

<ItemDeleteModal open={deleteModalIsOpen} item={currentItem} on:closed={handleModalDialog} />
