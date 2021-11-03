<script lang="ts">
import { ClaimCards, ItemsTable, Row } from 'components'
import { isLoadingById, loading } from 'components/progress'
import { Claim, loadClaimsByPolicyId, selectedPolicyClaims } from 'data/claims'
import { AccountablePersonOptions, getDependentOptions, getPolicyMemberOptions } from 'data/accountablePersons'
import { dependentsByPolicyId, loadDependents } from 'data/dependents'
import { deleteItem, loadItems, selectedPolicyItems } from 'data/items'
import { loadMembersOfPolicy, membersByPolicyId } from 'data/policy-members'
import * as routes from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let policyId: string

$: policyId && loadItems(policyId)
$: items = $selectedPolicyItems

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

const onGotoItem = (event: CustomEvent<string>) => $goto(event.detail)
</script>

<Page layout="grid">
  <Row cols={'12'}>
    <ClaimCards claims={$selectedPolicyClaims} {items} {accountablePersons} on:goto-claim={onGotoClaim} />
  </Row>

  <Row cols={'12'}>
    {#if $loading && isLoadingById(`policies/${policyId}/items`)}
      Loading items...
    {:else}
      <ItemsTable {items} {accountablePersons} {policyId} on:delete={onDelete} on:gotoItem={onGotoItem} />
    {/if}
  </Row>
</Page>
