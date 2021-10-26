<script lang="ts">
import { ClaimCards, Row, Breadcrumb } from 'components'
import { AccountablePersonOptions, getDependentOptions, getPolicyMemberOptions } from 'data/accountablePersons'
import { Claim, claims, loadClaims } from 'data/claims'
import { dependentsByPolicyId, loadDependents } from 'data/dependents'
import { itemsByPolicyId, loadItems } from 'data/items'
import { loadMembersOfPolicy, membersByPolicyId } from 'data/policy-members'
import { customerClaims, customerClaimDetails, customerClaimsNew } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Page, Button } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let policyId: string

const breadcrumbLinks = [{ name: 'Claims', url: customerClaims(policyId) }]

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

const onGotoClaim = (event: CustomEvent<Claim>) => $goto(customerClaimDetails(event.detail.policy_id, event.detail.id))
</script>

<Page layout="grid">
  <Breadcrumb links={breadcrumbLinks} />
  <!-- <Row cols={'12'}>
    <Button raised url={customerClaimsNew(policyId)}>New claim</Button>
  </Row> -->

  <Row cols={'12'}>
    {#if $claims.length}
      <ClaimCards {accountablePersons} claims={$claims} {items} on:goto-claim={onGotoClaim} />
    {:else}
      No claims at this time.
    {/if}
  </Row>
</Page>
