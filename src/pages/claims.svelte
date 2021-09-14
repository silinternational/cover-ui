<script lang="ts">
import user from '../authn/user'
import { ClaimCards, Row } from '../components/'
import { claims, initialized as claimsInitialized, loadClaims } from '../data/claims'
import { itemsByPolicyId, loadItems } from '../data/items'
import { goto } from '@roxi/routify'
import { Page, Button } from '@silintl/ui-components'

$: $claimsInitialized || loadClaims()

$: policyId = $user.policy_id
$: policyId && loadItems(policyId)
$: items = $itemsByPolicyId[policyId] || []

const onGotoClaim = event => $goto(`/claims/${event.detail}`)
</script>

<Page layout="grid">
  <Row cols={'12'}>
    <Button raised url="/claims/newClaim">New claim</Button>
  </Row>

  <Row cols={'12'}>
    {#if $claims.length}
      <ClaimCards claims={$claims} {items} on:goto-claim={onGotoClaim} />
    {:else}
      No claims at this time.
    {/if}
  </Row>
</Page>
