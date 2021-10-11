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
    default:
      // TODO: Eventually redirect signators to their own home page, too.
      console.error('Unknown role:', appRole)
  }
}
</script>
