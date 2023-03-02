<script lang="ts">
import { delayLoading, loading } from 'components/progress'
import type { PolicyItem } from 'data/items'
import { audits, repairAudits, repairedAudits, runAudits } from 'data/audits'
import { formatPageTitle } from 'helpers/pageTitle'
import { itemDetails, policyDetails } from 'helpers/routes'
import { isEqual } from 'lodash-es'
import { goto, metatags } from '@roxi/routify'
import { Button, Datatable, Page, setNotice } from '@silintl/ui-components'

metatags.title = formatPageTitle('Admin > Audit')

let canViewItemDetails = true
let utcDate = new Date().toISOString().split('T')[0]

$: items = $audits?.Items || []
$: haveAuditResults = $audits?.Items?.length

const onClick = () => {
  runAudits(utcDate)
}

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

const repair = async () => {
  try {
    await repairAudits(utcDate)
    const responseIsEqualToAudits = isEqual($audits.Items, $repairedAudits.Items)
    setNotice(
      responseIsEqualToAudits
        ? `All item records found to be at fault have been repaired.`
        : `Some item records found to be at fault were not repaired. Try running another audit.`
    )
    items = $repairedAudits.Items
  } catch {
    setNotice(`There was an error repairing the item records. Please try again.`)
  }
}
</script>

<Page>
  <h4>Audit Results (Items that were incorrectly renewed and billed)</h4>

  <div class="my-1">
    <Button class="mr-1" raised on:click={onClick}>run audits</Button>

    <Button outlined on:click={repair} disabled={!haveAuditResults}>repair</Button>
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
  {:else}
    {#await delayLoading($loading)}
      <p>Loading...</p>
    {:then is_loading}
      {#if $loading}
        <p>Loading...</p>
      {:else}
        <p>No items found.</p>
      {/if}
    {/await}
  {/if}
</Page>
