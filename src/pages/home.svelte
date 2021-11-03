<script lang="ts">
import { UserAppRole } from '../authn/user'
import { CUSTOMER_HOME } from 'helpers/routes'
import { redirect } from '@roxi/routify'
import { roleSelection } from 'data/role-policy-selection'

$: sendToRoleHome($roleSelection)

const sendToRoleHome = (appRole: string) => {
  switch (appRole) {
    case UserAppRole.Customer:
      $redirect(CUSTOMER_HOME)
      break
    case UserAppRole.Steward:
      $redirect('/steward/home')
      break
    case UserAppRole.Signator:
      $redirect('/signator/home')
      break
    default:
      console.error('Unknown role:', appRole)
      $redirect(CUSTOMER_HOME)
      break
  }
}
</script>
