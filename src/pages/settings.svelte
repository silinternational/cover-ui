<script lang="ts">
import user from '../authn/user'
import { settingsPolicy } from 'helpers/routes'
import { redirect } from '@roxi/routify'

$: $user.policy_id && $redirect(settingsPolicy($user.policy_id))
</script>
