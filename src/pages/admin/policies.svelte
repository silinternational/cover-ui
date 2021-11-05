<script lang="ts">
import { SearchForm } from 'components'
import { getNameOfPolicy, Policy, searchPoliciesFor } from 'data/policies'
import type { PolicyMember } from 'data/policy-members'
import { urlQuery } from 'data/query-string'
import { formatPageTitle } from 'helpers/pageTitle'
import { ADMIN_POLICIES, adminPolicySearch, policyDetails } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { Datatable, Page } from '@silintl/ui-components'

let matchingPolicies: Policy[] = []
let searchText = ''

metatags.title = formatPageTitle('Policies')

$: searchText = $urlQuery.search || ''
$: searchPoliciesFor(searchText).then((result) => (matchingPolicies = result))

const getNameOfMember = (member: PolicyMember) => member.first_name + ' ' + member.last_name

const onSearch = (event: CustomEvent) => {
  $goto(event.detail ? adminPolicySearch(event.detail) : ADMIN_POLICIES)
}
</script>

<style>
.material-icons {
  font-size: 125%;
  vertical-align: text-bottom;
}
.members {
  white-space: pre-line;
}
</style>

<Page>
  <SearchForm initial={searchText} on:search={onSearch} />
  <h3>
    {#if searchText}
      Policies matching "{searchText}"
    {:else}
      Recently-updated policies
    {/if}
  </h3>
  <Datatable>
    <Datatable.Header>
      <Datatable.Header.Item />
      <Datatable.Header.Item>Name</Datatable.Header.Item>
      <Datatable.Header.Item>Members</Datatable.Header.Item>
      <Datatable.Header.Item>Cost Center</Datatable.Header.Item>
      <Datatable.Header.Item>Entity</Datatable.Header.Item>
    </Datatable.Header>
    <Datatable.Data>
      {#each matchingPolicies as policy (policy.id)}
        <Datatable.Data.Row on:click={() => $goto(policyDetails(policy.id))} clickable>
          <!-- icon: -->
          <Datatable.Data.Row.Item>
            {#if policy.type === 'Household'}
              <span class="material-icons">family_restroom</span>
            {:else if policy.type === 'Corporate'}
              <span class="material-icons">business</span>
            {/if}
          </Datatable.Data.Row.Item>

          <!-- Name: -->
          <Datatable.Data.Row.Item>
            {#if policy.type === 'Household'}
              Household {policy.household_id}
            {:else}
              {getNameOfPolicy(policy)}
            {/if}
          </Datatable.Data.Row.Item>

          <Datatable.Data.Row.Item>
            <div class="members">
              {policy.members?.map(getNameOfMember).join('\n') || ''}
            </div>
          </Datatable.Data.Row.Item>

          <Datatable.Data.Row.Item>{policy.cost_center || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{policy.entity_code?.code || ''}</Datatable.Data.Row.Item>
        </Datatable.Data.Row>
      {/each}
    </Datatable.Data>
  </Datatable>
</Page>