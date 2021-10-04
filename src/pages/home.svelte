<script lang="ts">
import user from '../authn/user'
import { goto } from '@roxi/routify'

$: $user.app_role && sendToRoleHome($user.app_role)

const sendToRoleHome = (appRole: string) => {
  switch (appRole) {
    case 'User':
      $goto('/customer/home')
      break
    case 'Steward':
      $goto('/steward/home')
      break
    default:
      // TODO: Eventually redirect signators to their own home page, too.
      console.error('Unknown role:', appRole)
  }
}
</script>
