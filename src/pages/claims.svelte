<script lang="ts">
import user, { getDefaultPolicyId, isAdmin, User } from '../authn/user'
import { roleSelection, selectedPolicyId } from 'data/role-policy-selection'
import { ADMIN_HOME, customerClaims } from 'helpers/routes'
import { redirect } from '@roxi/routify'

$: redirectToAppropriatePolicyClaims($user, $selectedPolicyId)

const redirectToAppropriatePolicyClaims = (user: User, selectedPolicyId: string) => {
  if (isAdmin($roleSelection)) {
    $redirect(ADMIN_HOME)
  } else if (selectedPolicyId) {
    $redirect(customerClaims(selectedPolicyId))
  } else if (user.id) {
    $redirect(customerClaims(getDefaultPolicyId(user)))
  }
}
</script>
