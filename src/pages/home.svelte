<script lang="ts">
import user from '../authn/user'
import { CUSTOMER_HOME } from 'helpers/routes'
import { redirect } from '@roxi/routify'

$: $user.app_role && sendToRoleHome($user.app_role)

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
