<script lang="ts">
import user, { User } from '../../authn/user'
import { Policy } from 'data/policies'
import { policyHome } from 'helpers/routes'
import { redirect } from '@roxi/routify'

$: $user.id && redirectToAppropriatePolicy($user)

const redirectToAppropriatePolicy = (user: User) => {
  const policies = user.policies || []
  const corporatePolicies = policies.filter((p: Policy) => p.type === 'Corporate')
  const householdPolicies = policies.filter((p: Policy) => p.type === 'Household')

  const policyIdToUse = corporatePolicies[0]?.id || householdPolicies[0]?.id || user.policy_id
  $redirect(policyHome(policyIdToUse))
}
</script>
