<script lang="ts">
import { UserAppRole } from '../authn/user'
import { getLastPath, initialized } from '../authn/session'
import { ADMIN_HOME, CUSTOMER_HOME } from 'helpers/routes'
import { add, isBefore } from 'date-fns'
import { redirect } from '@roxi/routify'
import { roleSelection } from 'data/role-policy-selection'

$: {
  const lastPath = getLastPath()
  // if the last path was set withing the last 5 minutes assume we want to resume the session
  // only ever redirect to the last path once per session
  const shouldResumeSession = lastPath && !$initialized && isBefore(Date.now(), add(lastPath.lastSet, { minutes: 5 }))
  if (shouldResumeSession) {
    initialized.set(true)
    $redirect(lastPath.path)
  } else {
    sendToRoleHome($roleSelection)
  }
}

const sendToRoleHome = (appRole: string) => {
  switch (appRole) {
    case UserAppRole.Customer:
      $redirect(CUSTOMER_HOME)
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
      $redirect(CUSTOMER_HOME)
      break
  }
}
</script>
