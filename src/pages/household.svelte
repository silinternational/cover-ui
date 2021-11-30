<script lang="ts">
import { settingsPolicy } from 'helpers/routes'
import user, { getDefaultPolicyId } from '../authn/user'
import { redirect } from '@roxi/routify'

$: $user.policies?.length > 0 && $redirect(settingsPolicy(getDefaultPolicyId($user)))
</script>
