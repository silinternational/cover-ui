<script lang="ts">
import user from '../authn/user'
import { settingsPolicy } from 'helpers/routes'
import { redirect } from '@roxi/routify'
import { selectedPolicyId } from 'data/role-policy-selection'

$: $user.policy_id && $redirect(settingsPolicy($selectedPolicyId || $user.policy_id))
</script>
