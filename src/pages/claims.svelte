<script lang="ts">
import user from '../authn/user'
import { ClaimCards, Row, Breadcrumb } from '../components/'
import { claims, loadClaims } from '../data/claims'
import { itemsByPolicyId, loadItems } from '../data/items'
import { Page, Button } from '@silintl/ui-components'
import { onMount } from 'svelte'

$: policyId = $user.policy_id
$: policyId && loadItems(policyId)
$: items = $itemsByPolicyId[policyId] || []

onMount(() => {
  loadClaims()
})
</script>

<Page layout="grid">
  <Breadcrumb />
  <Row cols={'12'}>
    <Button raised url="/claims/newClaim">New claim</Button>
  </Row>

  <Row cols={'12'}>
    {#if $claims.length}
      <ClaimCards claims={$claims} {items} />
    {:else}
      No claims at this time.
    {/if}
  </Row>
</Page>
