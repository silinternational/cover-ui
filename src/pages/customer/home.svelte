<script lang="ts">
import user, { getDefaultPolicyId, User } from '../../authn/user'
import { selectedPolicyId } from 'data/role-policy-selection'
import { policyHome } from 'helpers/routes'
import { redirect } from '@roxi/routify'

$: redirectToAppropriatePolicy($user, $selectedPolicyId)

const redirectToAppropriatePolicy = (user: User, selectedPolicyId: string) => {
  if (selectedPolicyId) {
    $redirect(policyHome(selectedPolicyId))
  } else if (user.id) {
    $redirect(policyHome(getDefaultPolicyId(user)))
  }
}
</script>
