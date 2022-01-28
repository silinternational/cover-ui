<script lang="ts">
  import type { LedgerEntry } from 'data/ledger'
  import { formatMoney } from "helpers/money"
  import { sortByNum, sortByString } from 'helpers/sort'
  import { Datatable } from '@silintl/ui-components'

  export let header = 'Ledger List'
  export let ledgerEntries: LedgerEntry[] = []

  type Column = {
    id: string
    title: string
    numeric?: boolean
  }

  const columns: Column[] = [
    {
      id: 'name',
      title: 'Name',
    },
    {
      id: 'type',
      title: 'Type',
    },
    {
      id: 'entity_code',
      title: 'Entity',
    },
    {
      id: 'risk_category_name',
      title: 'Risk Category',
    },
    {
      id: 'policy_type',
      title: 'Policy Type',
    },
    {
      id: 'amount',
      title: 'Amount',
      numeric: true,
    },
  ]

  let id = 'name'
  let ascending = true
  let currentColumn = columns[0]

  const onSorted = (event: CustomEvent) => {
    ascending = event.detail.sortValue === 'ascending'
    id = event.detail.columnId || ''
    currentColumn = columns.find((column) => column.id === id) || columns[0]
  }

  $: sortedArray = currentColumn.numeric
    ? sortByNum(currentColumn.id, ledgerEntries, ascending)
    : sortByString(currentColumn.id, ledgerEntries, ascending)
</script>

<h3>
  {header}
</h3>

<Datatable on:sorted={onSorted}>
  <Datatable.Header>
    {#each columns as column}
      <Datatable.Header.Item numeric={column.numeric} columnID={column.id} sortable
      >{column.title}</Datatable.Header.Item
      >
    {/each}
  </Datatable.Header>
  <Datatable.Data>
    {#each sortedArray as row (row.id)}
      <Datatable.Data.Row>
        {#each columns as column}
          {#if column.numeric}
            <Datatable.Data.Row.Item numeric>{formatMoney(row[column.id])}</Datatable.Data.Row.Item>
          {:else}
            <Datatable.Data.Row.Item>{row[column.id] || ''}</Datatable.Data.Row.Item>
          {/if}
        {/each}
      </Datatable.Data.Row>
    {:else}
      <Datatable.Data.Row>
        <Datatable.Data.Row.Item colspan={columns.length}>
          <i>No data</i>
        </Datatable.Data.Row.Item>
      </Datatable.Data.Row>
    {/each}
  </Datatable.Data>
</Datatable>
