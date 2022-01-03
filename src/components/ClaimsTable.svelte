<script lang="ts">
import type { Claim } from '../data/claims'
import { getJustDateFromUTCDateString } from '../helpers/dates'
import { formatMoney } from 'helpers/money'
import { customerClaimDetails } from 'helpers/routes'
import { Datatable } from '@silintl/ui-components'

export let claims = [] as Claim[]
export let policyId: string
export let title = ''
</script>

{#if title}
  <h3>{title}</h3>
{/if}
<Datatable>
  <Datatable.Header>
    <Datatable.Header.Item>Reference #</Datatable.Header.Item>
    <Datatable.Header.Item>Incident Date</Datatable.Header.Item>
    <Datatable.Header.Item>Status</Datatable.Header.Item>
    <Datatable.Header.Item>Repairable</Datatable.Header.Item>
    <Datatable.Header.Item>Payout Option</Datatable.Header.Item>
    <Datatable.Header.Item numeric>Repair</Datatable.Header.Item>
    <Datatable.Header.Item numeric>Replacement</Datatable.Header.Item>
    <Datatable.Header.Item numeric>FMV</Datatable.Header.Item>
  </Datatable.Header>
  <Datatable.Data>
    {#each claims as claim (claim.id)}
      {#each claim.claim_items as claimItem (claimItem.id)}
        <Datatable.Data.Row>
          <Datatable.Data.Row.Item>
            <a href={customerClaimDetails(policyId, claim.id)}>{claim.reference_number || ''}</a>
            ({claim.status})
          </Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{getJustDateFromUTCDateString(claim.incident_date)}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{claimItem.status || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{claimItem.is_repairable ? 'Yes' : 'No'}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{claimItem.payout_option || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item numeric>{formatMoney(claimItem.repair_estimate)}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item numeric>{formatMoney(claimItem.replace_estimate)}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item numeric>{formatMoney(claimItem.fmv)}</Datatable.Data.Row.Item>
        </Datatable.Data.Row>
      {:else}
        <Datatable.Data.Row>
          <Datatable.Data.Row.Item>
            <a href={customerClaimDetails(policyId, claim.id)}>{claim.reference_number || ''}</a>
            ({claim.status})
          </Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{getJustDateFromUTCDateString(claim.incident_date)}</Datatable.Data.Row.Item>
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
