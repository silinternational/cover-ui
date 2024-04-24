<script lang="ts">
import user, { getDefaultPolicyId, isAdmin, type User } from 'data/user'
import { roleSelection, selectedPolicyId } from 'data/role-policy-selection'
import { ADMIN_HOME, items } from 'helpers/routes'
import { redirect } from '@roxi/routify'

$: redirectToAppropriatePolicyItems($user, $selectedPolicyId)

const redirectToAppropriatePolicyItems = (user: User, selectedPolicyId: string) => {
  if (isAdmin($roleSelection)) {
    $redirect(ADMIN_HOME)
  } else if (selectedPolicyId) {
    $redirect(items(selectedPolicyId))
  } else if (user.id) {
    $redirect(items(getDefaultPolicyId(user)))
  }
}
</script>
