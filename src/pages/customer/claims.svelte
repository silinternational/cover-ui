<script lang="ts">
import user from '../../authn/user'
import { ClaimCards, Row, Breadcrumb } from 'components'
import { AccountablePersonOptions, getDependentOptions, getPolicyMemberOptions } from 'data/accountablePersons'
import { claims, loadClaims } from 'data/claims'
import { dependentsByPolicyId, loadDependents } from 'data/dependents'
import { itemsByPolicyId, loadItems } from 'data/items'
import { loadMembersOfPolicy, membersByPolicyId } from 'data/policy-members'
import { CUSTOMER_CLAIMS_NEW } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { metatags } from '@roxi/routify'
import { Page, Button } from '@silintl/ui-components'
import { onMount } from 'svelte'

$: policyId = $user.policy_id

$: policyId && loadItems(policyId)
$: policyId && loadClaims()
$: policyId && loadDependents(policyId)
$: policyId && loadMembersOfPolicy(policyId)

$: items = $itemsByPolicyId[policyId] || []

$: dependents = $dependentsByPolicyId[policyId] || []
$: dependentOptions = getDependentOptions(dependents)

$: policyMembers = $membersByPolicyId[policyId] || []
$: policyMemberOptions = getPolicyMemberOptions(policyMembers)
$: accountablePersons = [...policyMemberOptions, ...dependentOptions] as AccountablePersonOptions[]
$: metatags.title = formatPageTitle('Claims')

onMount(() => {
  loadClaims()
})
</script>

<Page layout="grid">
  <Breadcrumb />
  <Row cols={'12'}>
    <Button raised url={CUSTOMER_CLAIMS_NEW}>New claim</Button>
  </Row>

  <Row cols={'12'}>
    {#if $claims.length}
      <ClaimCards {accountablePersons} claims={$claims} {items} />
    {:else}
      No claims at this time.
    {/if}
  </Row>
</Page>
