<script lang="ts">
import { Policy, searchPoliciesFor } from 'data/policies'
import { PolicyMember } from 'data/policy-members'
import { query } from 'data/query-string'
import { formatPageTitle } from 'helpers/pageTitle'
import { adminPolicySearch, policyDetails } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { Datatable, Form, Page, TextField } from '@silintl/ui-components'

let matchingPolicies: Policy[] = []
let mostRecentSearchQuery = ''
let searchFieldContents = ''

metatags.title = formatPageTitle('Policies')

$: doSearch($query.name || '')

const doSearch = async (name: string) => {
  searchFieldContents = name
  mostRecentSearchQuery = name
  matchingPolicies = await searchPoliciesFor(name)
}
const getNameOfMember = (member: PolicyMember) => {
  return member.first_name + ' ' + member.last_name
}
const onSubmit = () => putSearchIntoUrlQuery(searchFieldContents)
const putSearchIntoUrlQuery = (name) => $goto(adminPolicySearch(name))
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
  <Form on:submit={onSubmit}>
    Search:
    <TextField bind:value={searchFieldContents} placeholder="First or last name" />
  </Form>
  <h3>
    {#if mostRecentSearchQuery}
      Policies matching "{mostRecentSearchQuery}"
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
              <!-- TODO: Change to new corporate policy name field, when that field exists. -->
              {policy.account_detail}
            {/if}
          </Datatable.Data.Row.Item>

          <Datatable.Data.Row.Item>
            <div class="members">
              {policy.members.map(getNameOfMember).join('\n') || ''}
            </div>
          </Datatable.Data.Row.Item>

          <Datatable.Data.Row.Item>{policy.cost_center || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{policy.entity_code?.code || ''}</Datatable.Data.Row.Item>
        </Datatable.Data.Row>
      {/each}
    </Datatable.Data>
  </Datatable>
</Page>
