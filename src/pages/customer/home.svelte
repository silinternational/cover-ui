<script lang="ts">
import user, { User } from '../../authn/user'
import { Policy, PolicyType } from 'data/policies'
import { selectedPolicyId } from 'data/role-policy-selection'
import { policyHome } from 'helpers/routes'
import { redirect } from '@roxi/routify'

$: redirectToAppropriatePolicy($user, $selectedPolicyId)

const redirectToAppropriatePolicy = (user: User, selectedPolicyId: string) => {
  if (selectedPolicyId) {
    $redirect(policyHome(selectedPolicyId))
  } else if (user.id) {
    const policies = user.policies || []
    const teamPolicies = policies.filter((p: Policy) => p.type === PolicyType.Team)
    const householdPolicies = policies.filter((p: Policy) => p.type === PolicyType.Household)

    const policyIdToUse = teamPolicies[0]?.id || householdPolicies[0]?.id || user.policy_id
    $redirect(policyHome(policyIdToUse))
  }
}
</script>
