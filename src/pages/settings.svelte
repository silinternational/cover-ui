<script lang="ts">
import user, { getDefaultPolicyId } from 'data/user'
import { settingsPolicy } from 'helpers/routes'
import { redirect } from '@roxi/routify'
import { selectedPolicyId } from 'data/role-policy-selection'

$: $user.policies?.length > 0 && $redirect(settingsPolicy($selectedPolicyId || getDefaultPolicyId($user)))
</script>
