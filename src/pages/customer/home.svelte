<script lang="ts">
import user from '../../authn/user'
import { customerPolicy } from 'helpers/routes'
import { goto } from '@roxi/routify'

/* TODO: Load customer's corporate policies (if any) and intelligently decide
 * which policy to default to. */
$: $user.policy_id && $goto(customerPolicy($user.policy_id))
</script>
