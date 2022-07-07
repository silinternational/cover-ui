<script lang="ts">
import { isAdmin as checkIsAdmin } from 'data/user'
import { Breadcrumb, ClaimCards, ClaimsTable, Row } from 'components'
import { loading } from 'components/progress'
import { Claim, loadClaimsByPolicyId, selectedPolicyClaims } from 'data/claims'
import { getNameOfPolicy, selectedPolicy } from 'data/policies'
import { roleSelection } from 'data/role-policy-selection'
import { customerClaims, customerClaimDetails, POLICIES, policyDetails } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { items } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let policyId: string

$: policy = $selectedPolicy
$: policyId && loadClaimsByPolicyId(policyId)
$: isAdmin = checkIsAdmin($roleSelection)

$: policyName = getNameOfPolicy(policy)
$: adminBreadcrumbs = isAdmin
  ? [
      { name: 'Policies', url: POLICIES },
      { name: policyName, url: policyDetails(policyId) },
    ]
  : []

$: breadcrumbLinks = [...adminBreadcrumbs, { name: 'Claims', url: customerClaims(policyId), icon: 'assignment' }]
$: metatags.title = formatPageTitle('Claims')

const onGotoClaim = (event: CustomEvent<Claim>) => $goto(customerClaimDetails(event.detail.policy_id, event.detail.id))
</script>

<Page layout="grid">
  {#if isAdmin}
    <Breadcrumb links={breadcrumbLinks} />
  {/if}
  <!-- <Row cols={'12'}>
    <Button raised url={customerClaimsNew(policyId)}>New claim</Button>
  </Row> -->

  <Row cols={'12'}>
    {#if $selectedPolicyClaims.length}
      <ClaimCards {isAdmin} claims={$selectedPolicyClaims} on:goto-claim={onGotoClaim} />
      <ClaimsTable claims={$selectedPolicyClaims} {policyId} />
    {:else if $loading}
      ...Loading claims
    {:else}
      <p class="m-0-auto text-align-center">You don't have any claims in this policy</p>
      <p class="m-0-auto text-align-center">
        <a class="m-1 mdc-theme--primary" href={items(policyId)}>Pick an item to file a claim</a>
      </p>
    {/if}
  </Row>
</Page>
