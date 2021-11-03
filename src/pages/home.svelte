<script lang="ts">
import user from '../authn/user'
import { CUSTOMER_HOME } from 'helpers/routes'
import { redirect } from '@roxi/routify'
import { roleSelection } from 'data/role-policy-selection'

$: sendToRoleHome($roleSelection)

const sendToRoleHome = (appRole: string) => {
  switch (appRole) {
    case 'User':
      $redirect(CUSTOMER_HOME)
      break
    case 'Steward':
      $redirect('/steward/home')
      break
    case 'Signator':
      $redirect('/signator/home')
      break
    default:
      console.error('Unknown role:', appRole)
      $redirect(CUSTOMER_HOME)
      break
  }
}
</script>
