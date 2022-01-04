<script lang="ts">
import user, { getDefaultPolicyId, User } from 'data/user'
import type { Policy } from 'data/policies'
import { selectedPolicyId } from 'data/role-policy-selection'
import { policyHome } from 'helpers/routes'
import { redirect } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

let policies: Policy[]

$: redirectToAppropriatePolicy($user, $selectedPolicyId)
$: policies = $user.policies || []

const redirectToAppropriatePolicy = (user: User, selectedPolicyId: string) => {
  if (selectedPolicyId) {
    $redirect(policyHome(selectedPolicyId))
  } else if (user.policies?.length > 0) {
    $redirect(policyHome(getDefaultPolicyId(user)))
  }
}
</script>

<Page>
  {#if policies.length < 1}
    <p>Loading your policy information...</p>
  {/if}
</Page>
