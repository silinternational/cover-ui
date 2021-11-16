<script lang="ts">
import user from '../authn/user'
import { settingsPolicy } from 'helpers/routes'
import { redirect } from '@roxi/routify'
import { selectedPolicyId } from 'data/role-policy-selection'

$: $selectedPolicyId ? $redirect(settingsPolicy($selectedPolicyId)) : $redirect(settingsPolicy($user.policy_id))
</script>
