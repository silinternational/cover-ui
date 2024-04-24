<script lang="ts">
import user, { getDefaultPolicyId, type User, UserAppRole } from 'data/user'
import { selectedPolicyId } from '../data/role-policy-selection'
import { ADMIN_HOME, policyDetails } from 'helpers/routes'
import { redirect } from '@roxi/routify'
import { roleSelection } from 'data/role-policy-selection'

$: sendToRoleHome($roleSelection)

const sendToRoleHome = (appRole: string) => {
  switch (appRole) {
    case UserAppRole.Customer:
      redirectToAppropriatePolicy($user, $selectedPolicyId)
      break
    case UserAppRole.Steward:
    case UserAppRole.Signator:
      $redirect(ADMIN_HOME)
      break
    case undefined:
      // Don't redirect the user anywhere if we don't know their role yet.
      break
    default:
      console.error('Unknown role:', appRole)
      $redirect(policyDetails(getDefaultPolicyId($user)))
      break
  }
}

const redirectToAppropriatePolicy = (user: User, selectedPolicyId: string): void => {
  if (selectedPolicyId) {
    $redirect(policyDetails(selectedPolicyId))
  } else if (user.policies?.length > 0) {
    $redirect(policyDetails(getDefaultPolicyId(user)))
  }
}
</script>
