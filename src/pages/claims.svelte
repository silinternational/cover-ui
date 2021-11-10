<script lang="ts">
import user, { getDefaultPolicyId, User } from '../authn/user'
import { selectedPolicyId } from 'data/role-policy-selection'
import { customerClaims } from 'helpers/routes'
import { redirect } from '@roxi/routify'

$: redirectToAppropriatePolicyClaims($user, $selectedPolicyId)

const redirectToAppropriatePolicyClaims = (user: User, selectedPolicyId: string) => {
  if (selectedPolicyId) {
    $redirect(customerClaims(selectedPolicyId))
  } else if (user.id) {
    $redirect(customerClaims(getDefaultPolicyId(user)))
  }
}
</script>
