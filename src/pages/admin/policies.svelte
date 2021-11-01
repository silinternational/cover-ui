<script lang="ts">
import { searchPoliciesFor } from 'data/policies'
import { PolicyMember } from 'data/policy-members'
import { formatPageTitle } from 'helpers/pageTitle'
import { policyDetails } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { Datatable, Form, Page, TextField } from '@silintl/ui-components'
import { onMount } from 'svelte'

metatags.title = formatPageTitle('Policies')

let matchingPolicies = []
let searchFieldContents = ''
let searchedFor = ''

const getNameOfMember = (member: PolicyMember) => {
  return member.first_name + ' ' + member.last_name
}
const doSearch = async () => {
  searchedFor = searchFieldContents
  matchingPolicies = await searchPoliciesFor(searchedFor)
}

onMount(() => {
  doSearch()
})
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
  <Form on:submit={doSearch}>
    Search:
    <TextField bind:value={searchFieldContents} placeholder="First or last name" />
  </Form>
  <h3>
    {#if searchedFor}
      Policies matching {searchedFor}
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
