<script lang="ts">
import { CardsGrid, ItemsTable, Row } from 'components'
import { isLoadingPolicyItems, loading } from 'components/progress'
import { Claim, loadClaimsByPolicyId, selectedPolicyClaims } from 'data/claims'
import { AccountablePersonOptions, getDependentOptions, getPolicyMemberOptions } from 'data/accountablePersons'
import { dependentsByPolicyId, loadDependents } from 'data/dependents'
import { deleteItem, loadItems, PolicyItem, selectedPolicyItems } from 'data/items'
import { getNameOfPolicy, selectedPolicy } from 'data/policies'
import { loadMembersOfPolicy, membersByPolicyId } from 'data/policy-members'
import * as routes from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let policyId: string

$: policyId && loadItems(policyId)
$: policyId && loadClaimsByPolicyId(policyId)

$: policyId && loadDependents(policyId)
$: dependents = $dependentsByPolicyId[policyId] || []
$: dependentOptions = getDependentOptions(dependents)

$: policyId && loadMembersOfPolicy(policyId)
$: policyMembers = $membersByPolicyId[policyId] || []
$: policyMemberOptions = getPolicyMemberOptions(policyMembers)
$: accountablePersons = [...policyMemberOptions, ...dependentOptions] as AccountablePersonOptions[]
$: metatags.title = formatPageTitle('Home')

const onDelete = async (event: CustomEvent<any>) => {
  const itemId = event.detail
  await deleteItem(policyId, itemId)

  // Depending on if the item was a draft or approved it will either be deleted or updated
  // Just reload the list for now since the delete endpoint doesn't yet tell us what happened
  loadItems(policyId)
}

const onGotoClaim = (event: CustomEvent<Claim>) =>
  $goto(routes.customerClaimDetails(event.detail.policy_id, event.detail.id))

const onGotoPolicyItem = (event: CustomEvent<PolicyItem>) =>
  $goto(routes.itemDetails(event.detail.policy_id, event.detail.id))

const onGotoItem = (event: CustomEvent<string>) => $goto(event.detail)
</script>

<Page layout="grid">
  <Row cols={'12'}>
    <h3>{getNameOfPolicy($selectedPolicy)} Policy</h3>
    <CardsGrid
      {accountablePersons}
      claims={$selectedPolicyClaims}
      policyItems={$selectedPolicyItems}
      on:goto-claim={onGotoClaim}
      on:goto-item={onGotoPolicyItem}
    />
  </Row>

  <Row cols={'12'}>
    {#if $selectedPolicyItems.length > 0}
      <ItemsTable
        items={$selectedPolicyItems}
        {accountablePersons}
        {policyId}
        on:delete={onDelete}
        on:gotoItem={onGotoItem}
      />
    {:else if $loading && isLoadingPolicyItems(policyId)}
      Loading items...
    {:else}{/if}
  </Row>
</Page>
