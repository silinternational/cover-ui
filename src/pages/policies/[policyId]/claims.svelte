<script lang="ts">
import { UserAppRole } from '../../../authn/user'
import { ClaimCards, Row, Breadcrumb } from 'components'
import { Claim, loadClaimsByPolicyId, selectedPolicyClaims } from 'data/claims'
import { loadItems } from 'data/items'
import { getNameOfPolicy, selectedPolicy } from 'data/policies'
import { roleSelection } from 'data/role-policy-selection'
import { customerClaims, customerClaimDetails, POLICIES, policyDetails } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { items } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { Button, Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let policyId: string
$: policy = $selectedPolicy

$: policyName = getNameOfPolicy(policy)
$: isAdmin = $roleSelection !== UserAppRole.Customer
$: adminBreadcrumbs = isAdmin
  ? [
      { name: 'Policies', url: POLICIES },
      { name: policyName, url: policyDetails(policyId) },
    ]
  : []

$: breadcrumbLinks = [...adminBreadcrumbs, { name: 'Claims', url: customerClaims(policyId) }]
$: metatags.title = formatPageTitle('Claims')

onMount(() => {
  loadItems(policyId)
  loadClaimsByPolicyId(policyId)
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
      <ClaimCards {isAdmin} claims={$selectedPolicyClaims} on:goto-claim={onGotoClaim} />
    {:else}
      <p class="m-0-auto text-align-center">You don't have any claims in this policy</p>
      <p class="m-0-auto text-align-center">
        <a class="m-1 mdc-theme--primary" href={items(policyId)}>Pick an item to file a claim</a>
      </p>
    {/if}
  </Row>
</Page>
