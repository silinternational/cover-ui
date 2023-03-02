<script lang="ts">
import { delayLoading, loading } from 'components/progress'
import type { PolicyItem } from 'data/items'
import { formatDate } from 'helpers/dates'
import { formatMoney } from 'helpers/money'
import { itemDetails, policyDetails } from 'helpers/routes'
import { goto } from '@roxi/routify'
import { Button, Datatable } from '@silintl/ui-components'

export let items: PolicyItem[] = []

let canViewItemDetails = true

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
</script>

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
          <Datatable.Data.Row.Item>{formatMoney(item.annual_premium)}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{formatDate(item.coverage_end_date)}</Datatable.Data.Row.Item>
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
