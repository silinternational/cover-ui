<script lang="ts">
import { UserAppRole } from '../../../authn/user'
import { ClaimCards, Row, Breadcrumb } from 'components'
import { AccountablePersonOptions, getDependentOptions, getPolicyMemberOptions } from 'data/accountablePersons'
import { Claim, loadClaimsByPolicyId, selectedPolicyClaims } from 'data/claims'
import { dependentsByPolicyId, loadDependents } from 'data/dependents'
import { loadItems, selectedPolicyItems } from 'data/items'
import { selectedPolicy } from 'data/policies'
import { loadMembersOfPolicy, membersByPolicyId } from 'data/policy-members'
import { roleSelection } from 'data/role-policy-selection'
import { customerClaims, customerClaimDetails, POLICIES, policyDetails } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let policyId: string
$: policy = $selectedPolicy

$: policyName = policy.type === 'Corporate' ? policy.account_detail : policy.household_id
$: isAdmin = $roleSelection !== UserAppRole.Customer
$: adminBreadcrumbs = isAdmin
  ? [
      { name: 'Policies', url: POLICIES },
      { name: policyName, url: policyDetails(policyId) },
    ]
  : []

$: breadcrumbLinks = [...adminBreadcrumbs, { name: 'Claims', url: customerClaims(policyId) }]

$: items = $selectedPolicyItems

$: dependents = $dependentsByPolicyId[policyId] || []
$: dependentOptions = getDependentOptions(dependents)

$: policyMembers = $membersByPolicyId[policyId] || []
$: policyMemberOptions = getPolicyMemberOptions(policyMembers)
$: accountablePersons = [...policyMemberOptions, ...dependentOptions] as AccountablePersonOptions[]
$: metatags.title = formatPageTitle('Claims')

onMount(() => {
  loadItems(policyId)
  loadClaimsByPolicyId(policyId)
  loadDependents(policyId)
  loadMembersOfPolicy(policyId)
})

const onGotoClaim = (event: CustomEvent<Claim>) => $goto(customerClaimDetails(event.detail.policy_id, event.detail.id))
</script>

<Page layout="grid">
  <Breadcrumb links={breadcrumbLinks} />
  <!-- <Row cols={'12'}>
    <Button raised url={customerClaimsNew(policyId)}>New claim</Button>
  </Row> -->

  <Row cols={'12'}>
    {#if $selectedPolicyClaims.length}
      <ClaimCards {accountablePersons} {isAdmin} claims={$selectedPolicyClaims} {items} on:goto-claim={onGotoClaim} />
    {:else}
      No claims at this time.
    {/if}
  </Row>
</Page>
