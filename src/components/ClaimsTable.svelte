<script lang="ts">
import { type Claim, ClaimStatus } from '../data/claims'
import { formatFriendlyDate } from '../helpers/dates'
import { formatMoney } from 'helpers/money'
import { customerClaimDetails } from 'helpers/routes'
import { sortBy } from 'helpers/sort'
import { Datatable } from '@silintl/ui-components'

type Column = {
  title: string
  headerId: string
  numeric?: boolean
  path: string
}

export let claims = [] as Claim[]
export let policyId: string
export let title = ''

const columns: Column[] = [
  {
    title: 'Reference #',
    headerId: 'reference',
    path: 'reference_number',
  },
  {
    title: 'Incident Date',
    headerId: 'incident_date',
    path: 'incident_date',
  },
  {
    title: 'Status',
    headerId: 'status',
    path: 'status',
  },
  {
    title: 'Repairable',
    headerId: 'repairable',
    path: 'claim_items.0.is_repairable',
  },
  {
    title: 'Payout Option',
    headerId: 'payout_option',
    path: 'claim_items.0.payout_option',
  },
  // {
  //   title: 'Repair',
  //   headerId: 'repair',
  //   numeric: true,
  //   path: 'claim_items.0.repair_estimate',
  // },
  // {
  //   title: 'Replacement',
  //   headerId: 'replacement',
  //   numeric: true,
  //   path: 'claim_items.0.replace_estimate',
  // },
  // {
  //   title: 'FMV',
  //   headerId: 'fmv',
  //   numeric: true,
  //   path: 'claim_items.0.fmv',
  // },
  {
    title: 'Payout',
    headerId: 'payout_amount',
    numeric: true,
    path: 'claim_items.0.payout_amount',
  },
]

let headerId = 'reference'
let ascending = true
let currentColumn = columns[0]

$: sortedClaimsArray = sortBy(currentColumn.numeric, currentColumn.path, claims, ascending) as Claim[]

const onSorted = (event: CustomEvent) => {
  ascending = event.detail.sortValue === 'ascending'
  headerId = event.detail.columnId || ''
  currentColumn = columns.find((column) => column.headerId === headerId) || columns[0]
}

const formatPayout = (claim: Claim, payout: number) => {
  if (payout) {
    const money = formatMoney(payout)
    return claim.status === ClaimStatus.Paid ? money : `est. ${money}`
  } else return '-'
}
</script>

{#if title}
  <h3>{title}</h3>
{/if}
<Datatable on:sorted={onSorted}>
  <Datatable.Header>
    {#each columns as column}
      <Datatable.Header.Item numeric={column.numeric} columnID={column.headerId} sortable>
        {column.title}
      </Datatable.Header.Item>
    {/each}
  </Datatable.Header>
  <Datatable.Data>
    {#each sortedClaimsArray as claim (claim.id)}
      {#each claim.claim_items as claimItem (claimItem.id)}
        <Datatable.Data.Row>
          <Datatable.Data.Row.Item>
            <a href={customerClaimDetails(policyId, claim.id)}>{claim.reference_number || ''}</a>
            ({claim.status})
          </Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{formatFriendlyDate(claim.incident_date)}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{claimItem.status || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{claimItem.is_repairable ? 'Yes' : 'No'}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{claimItem.payout_option || ''}</Datatable.Data.Row.Item>
          <!-- <Datatable.Data.Row.Item numeric>
            {formatMoney(claimItem.repair_actual || claimItem.repair_estimate)}
          </Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item numeric>
            {formatMoney(claimItem.replace_actual || claimItem.replace_estimate)}
          </Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item numeric>{formatMoney(claimItem.fmv)}</Datatable.Data.Row.Item> -->
          <Datatable.Data.Row.Item numeric>{formatPayout(claim, claimItem.payout_amount)}</Datatable.Data.Row.Item>
        </Datatable.Data.Row>
      {:else}
        <Datatable.Data.Row>
          <Datatable.Data.Row.Item>
            <a href={customerClaimDetails(policyId, claim.id)}>{claim.reference_number || ''}</a>
            ({claim.status})
          </Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{formatFriendlyDate(claim.incident_date)}</Datatable.Data.Row.Item>
        </Datatable.Data.Row>
      {/each}
    {:else}
      <Datatable.Data.Row>
        <Datatable.Data.Row.Item colspan={8}>
          <i>None</i>
        </Datatable.Data.Row.Item>
      </Datatable.Data.Row>
    {/each}
  </Datatable.Data>
</Datatable>
