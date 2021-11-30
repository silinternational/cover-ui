<script lang="ts">
import { selectedPolicyId } from 'data/role-policy-selection'
import { settingsPolicy } from 'helpers/routes'
import user from '../authn/user'
import { redirect } from '@roxi/routify'

$: $user.policies?.length > 0 && $redirect(settingsPolicy($selectedPolicyId))
</script>
