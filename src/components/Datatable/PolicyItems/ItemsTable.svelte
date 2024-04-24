<script lang="ts">
import BatchItemClone from './BatchItemClone.svelte'
import BatchItemDelete from './BatchItemDelete.svelte'
import CopyTableButton from '../CopyTableButton.svelte'
import { type ClaimItem, incompleteClaimItemStatuses, selectedPolicyClaims } from 'data/claims'
import { getItemState } from 'data/states'
import { type AccountablePerson, editableCoverageStatuses, ItemCoverageStatus, type PolicyItem } from 'data/items'
import { isMonthly } from 'helpers/coverage'
import { formatDate, formatFriendlyDate } from 'helpers/dates'
import { getItemIcon, hasEnded, willEnd } from './itemTableHelpers'
import { throwError } from '../../../error'
import { formatMoney } from 'helpers/money'
import { itemDetails, itemEdit } from 'helpers/routes'
import { sortBy } from 'helpers/sort'
import ItemDeleteModal from '../../ItemDeleteModal.svelte'
import RowItem from './RowItem.svelte'
import type { Column } from '../types'
import 'iconify-icon'
import { capitalize } from 'lodash-es'
import { createEventDispatcher } from 'svelte'
import { Checkbox, Datatable, IconButton, Menu, type MenuItem } from '@silintl/ui-components'
import { generateRandomID } from '@silintl/ui-components/random'

export let items = [] as PolicyItem[]
export let policyId: string
export let title: string = ''
export let includeCopyToClipboard: boolean = true
export let uniqueTableClass = generateRandomID('items-table-')

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
    path: 'annual_premium',
    sortable: true,
  },
  {
    title: 'Recent Activity',
    headerId: 'recent_activity',
    path: 'updated_at',
    sortable: true,
  },
]

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
$: sortedItemsArray = sortBy(currentColumn.numeric, currentColumn.path, items, ascending) as PolicyItem[]
$: allCheckedItemsAreDraft =
  checkedItems.length > 0 && checkedItems.every((item) => item.coverage_status === ItemCoverageStatus.Draft)
$: batchActionIsDisabled = checkedItems.length === 0
$: batchDeleteIsDisabled =
  batchActionIsDisabled ||
  checkedItems.some((item) => item.coverage_end_date || item.coverage_status === ItemCoverageStatus.Inactive)
$: items && (checkedItems = returnFilteredCheckedItems())

const dispatch = createEventDispatcher()

const getMenuItems = (item: PolicyItem) => {
  const menuItems: MenuItem[] = []

  if (item.coverage_status !== ItemCoverageStatus.Draft) {
    menuItems.push({
      label: 'View item',
      url: itemDetails(policyId, item.id),
    })
  }
  if (item.coverage_status !== ItemCoverageStatus.Inactive) {
    menuItems.push({
      label: item.coverage_status === ItemCoverageStatus.Draft ? 'Delete' : 'End coverage',
      action: handleDeleteClick,
    })
  }
  if (editableCoverageStatuses.includes(item.coverage_status)) {
    menuItems.push({
      label: 'Edit item',
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

//TODO - use the items flags to determine if the user can delete or end coverage
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
const getStatusClass = (status: ItemCoverageStatus) =>
  status === ItemCoverageStatus.Draft ? 'mdc-theme--primary mdc-bold-font' : ''
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

{#if title}
  <h3>{title}</h3>
{/if}

<div class="flex align-items-center">
  <BatchItemDelete isDisabled={batchDeleteIsDisabled} {allCheckedItemsAreDraft} on:closed={handleClosed} />

  <BatchItemClone isDisabled={batchActionIsDisabled} {selectedItemNames} on:closed={handleClosed} />

  <Checkbox
    on:checked={toggleShowSnMakeAndModel}
    on:unchecked={toggleShowSnMakeAndModel}
    label="Show Serial, Make and Model"
  />
</div>
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
    <Datatable.Header.Item><iconify-icon icon="mdi:category" /></Datatable.Header.Item>
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
        <RowItem status={item.coverage_status}><iconify-icon icon={getItemIcon(item.category.key)} /></RowItem>
        <RowItem status={item.coverage_status}>{item.name || ''}</RowItem>
        {#if snMakeAndModelAreVisible}
          <RowItem status={item.coverage_status}>{item.serial_number || ''}</RowItem>
          <RowItem status={item.coverage_status}>{item.make || ''}</RowItem>
          <RowItem status={item.coverage_status}>{item.model || ''}</RowItem>
        {/if}
        <RowItem status={item.coverage_status} className={getStatusClass(item.coverage_status)}>
          {#if willEnd(item)}
            <div class="red">
              Covered through
              {formatFriendlyDate(item.coverage_end_date)}
            </div>
          {:else if hasEnded(item)}
            Coverage ended
            {formatFriendlyDate(item.coverage_end_date)}
          {:else}
            {getItemState(item.coverage_status)?.title || ''}
          {/if}
        </RowItem>
        <RowItem status={item.coverage_status}>{item.accountable_person?.name || ''}</RowItem>
        <RowItem status={item.coverage_status}>{item.accountable_person?.country || item.country || ''}</RowItem>
        <RowItem status={item.coverage_status} numeric>{formatMoney(item.coverage_amount)}</RowItem>
        <RowItem status={item.coverage_status} numeric>
          {formatMoney(item.annual_premium)}
          {#if isMonthly(item)}
            <div>
              <small class="tw-opacity-60">({formatMoney(item.monthly_premium)}/month)</small>
            </div>
          {/if}
        </RowItem>
        <RowItem status={item.coverage_status}>{formatDate(item.updated_at)}</RowItem>
        <RowItem>
          <IconButton icon="more_vert" on:click={() => handleMoreVertClick(item.id)} />
          <div class="item-menu">
            <Menu bind:menuOpen={shownMenus[item.id]} menuItems={getMenuItems(item)} />
          </div>
        </RowItem>
      </Datatable.Data.Row>
    {:else}
      <tr>
        <RowItem className="p-1">
          <i>None</i>
        </RowItem>
      </tr>
    {/each}
  </Datatable.Data>
</Datatable>
{#if includeCopyToClipboard}
  <CopyTableButton {uniqueTableClass} />
{/if}
<ItemDeleteModal open={deleteModalIsOpen} item={currentItem} on:closed={handleModalDialog} />
