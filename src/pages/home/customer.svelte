<script lang="ts">
import user from '../../authn/user'
import { goto } from '@roxi/routify'

/* TODO: Load customer's corporate policies (if any) and intelligently decide
 * which policy to default to. */
$goto(`/customer/home/${$user.policy_id}`)
</script>
