<script lang="ts">
import { initialized, loadPolicies, policies } from '../data/policies'
import { goto } from '@roxi/routify'
import { Datatable, Page } from '@silintl/ui-components'

$: $initialized || loadPolicies()
</script>

<style>
.material-icons {
  font-size: 125%;
  vertical-align: text-bottom;
}
</style>

<Page>
  <Datatable>
    <Datatable.Header>
      <Datatable.Header.Item>Type</Datatable.Header.Item>
      <Datatable.Header.Item>Household ID</Datatable.Header.Item>
      <Datatable.Header.Item>Account</Datatable.Header.Item>
      <Datatable.Header.Item>Cost Center</Datatable.Header.Item>
      <Datatable.Header.Item>Entity Code</Datatable.Header.Item>
      <Datatable.Header.Item>Members</Datatable.Header.Item>
      <Datatable.Header.Item>Claims</Datatable.Header.Item>
    </Datatable.Header>
    <Datatable.Data>
      {#each $policies as policy (policy.id) }
        <Datatable.Data.Row on:click={() => $goto(`/policies/${policy.id}`)} clickable>
          <Datatable.Data.Row.Item>
            {#if policy.type === 'Household' }
              <span class="material-icons">family_restroom</span>
            {:else if policy.type === 'Corporate' }
              <span class="material-icons">business</span>
            {/if}
            {policy.type || ''}
          </Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{policy.household_id || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{policy.account || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{policy.cost_center || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{policy.entity_code?.code || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{policy.members?.length || 0}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{policy.claims?.length || 0}</Datatable.Data.Row.Item>
        </Datatable.Data.Row>
      {/each}
    </Datatable.Data>
  </Datatable>
</Page>
