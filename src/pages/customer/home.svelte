<script lang="ts">
import user from '../../authn/user'
import { policyHome } from 'helpers/routes'
import { redirect } from '@roxi/routify'

/* TODO: Load customer's corporate policies (if any) and intelligently decide
 * which policy to default to. */
$: $user.policy_id && $redirect(policyHome($user.policy_id))
</script>
