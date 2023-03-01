<script lang="ts">
import { loading } from 'components/progress'
import type { PolicyItem } from 'data/items'
import { AuditResult, runAudits } from 'data/audits'
import { formatPageTitle } from 'helpers/pageTitle'
import { itemDetails, policyDetails } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { onMount } from 'svelte'
import { Button, Datatable, Page, setNotice } from '@silintl/ui-components'

metatags.title = formatPageTitle('Admin > Audit')

let auditResult: AuditResult
let canViewItemDetails = true
let utcDate = new Date().toISOString().split('T')[0]

$: items = auditResult?.Items || [
  {
    accountable_person: 'asdfsdfa',
    annual_premium: 12,
    category: 'asdfasdf' /*ItemCategory*/,
    country: 'sdfasdfs',
    coverage_amount: 'number',
    coverage_end_date: 'string' /*Date*/,
    coverage_start_date: 'string' /* yyyy-mm-dd Date */,
    coverage_status: 'ItemCoverageStatus',
    created_at: 'string' /*Date*/,
    description: 'string',
    id: 'string',
    in_storage: 'boolean',
    make: 'string',
    model: 'string',
    name: 'string',
    policy_id: 'string',
    prorated_annual_premium: 12,
    risk_category: 'RiskCategory',
    serial_number: 'string',
    status_change: 'string',
    status_reason: 'string',
    updated_at: 'string' /*Date*/,
  },
]

onMount(async () => {
  auditResult = await runAudits(utcDate)
})

const gotoItemDetails = (item: PolicyItem) => {
  if (canViewItemDetails) {
    $goto(itemDetails(item.policy_id, item.id))
  } else {
    canViewItemDetails = true
  }
}

const preventRowClick = async () => {
  canViewItemDetails = false
}

const repair = async (item: PolicyItem) => {
  //TODO: repair the item using post /repair endpoint
  console.log('repairing', item.name)

  setNotice(`Item ${item.name} has been repaired.`)
}
</script>

<Page>
  <div class="flex justify-between align-items-center">
    <h4>Audit Results (Items that were incorrectly renewed and billed)</h4>

    <Button raised on:click={repair} disabled={!items.length}>repair</Button>
  </div>
  {#if items.length}
    <Datatable>
      <Datatable.Header>
        <Datatable.Header.Item>Name</Datatable.Header.Item>
        <Datatable.Header.Item>Policy</Datatable.Header.Item>
        <Datatable.Header.Item>Annual Premium</Datatable.Header.Item>
        <Datatable.Header.Item>End Date</Datatable.Header.Item>
        <Datatable.Header.Item>Coverage Status</Datatable.Header.Item>
        <Datatable.Header.Item>Action</Datatable.Header.Item>
      </Datatable.Header>
      <Datatable.Data>
        {#each items as item (item.id)}
          <Datatable.Data.Row on:click={() => gotoItemDetails(item)} clickable>
            <Datatable.Data.Row.Item>{item.name}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>{item.policy_id}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>{item.annual_premium}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>{item.coverage_end_date}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>{item.coverage_status}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>
              <Button url={policyDetails(item.policy_id)} on:click={preventRowClick}>view policy</Button>
            </Datatable.Data.Row.Item>
          </Datatable.Data.Row>
        {/each}
      </Datatable.Data>
    </Datatable>
  {:else if $loading}
    <p>Loading...</p>
  {:else}
    <p>No items found.</p>
  {/if}
</Page>
