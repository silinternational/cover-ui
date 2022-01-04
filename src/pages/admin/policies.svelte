<script lang="ts">
import { Paginator, SearchForm } from 'components'
import { getNameOfPolicy, Policy, PolicyType, searchPoliciesFor } from 'data/policies'
import type { PolicyMember } from 'data/policy-members'
import { urlQuery } from 'data/query-string'
import { formatPageTitle } from 'helpers/pageTitle'
import { ADMIN_POLICIES, adminPolicySearch, policyDetails } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { Datatable, Page } from '@silintl/ui-components'
import qs from 'qs'
import { onMount } from 'svelte'
import type { PaginatedData } from 'data/types/PaginatedData'

let matchingPolicies: Policy[] = []
let pageData: PaginatedData = {} as PaginatedData
let searchText = ''

metatags.title = formatPageTitle('Policies')

onMount(() => search())

$: searchText = $urlQuery.search || ''
$: pageData.page = Number($urlQuery.page) || 1
$: pageData.per_page = Number($urlQuery.limit) || 20
$: limitSelection = 'limit-' + pageData.per_page

const search = () => {
  searchPoliciesFor(searchText, pageData.page, pageData.per_page).then((result) => {
    matchingPolicies = result.data
    pageData = result.meta

    $goto(adminPolicySearch(qs.stringify({ search: searchText, page: pageData.page, limit: pageData.per_page })))
  })
}
const getNameOfMember = (member: PolicyMember) => member.first_name + ' ' + member.last_name

const onSearch = (event: CustomEvent<string>) => {
  if (!event.detail) {
    $goto(ADMIN_POLICIES)
  } else {
    searchText = event.detail
    pageData.page = 1
    search()
  }
}
const onPaginate = (event: CustomEvent<{ page: number; limit: number }>) => {
  pageData.page = event.detail.page
  pageData.per_page = event.detail.limit
  search()
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
            {#if policy.type === PolicyType.Household}
              <span class="material-icons">family_restroom</span>
            {:else if policy.type === PolicyType.Team}
              <span class="material-icons">business</span>
            {/if}
          </Datatable.Data.Row.Item>

          <!-- Name: -->
          <Datatable.Data.Row.Item>
            {#if policy.type === PolicyType.Household}
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
  <Paginator {pageData} thingName="policies" on:paginate={onPaginate} {limitSelection} />
</Page>
