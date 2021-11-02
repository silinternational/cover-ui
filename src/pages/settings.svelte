<script lang="ts">
import user from '../authn/user'
import { settingsPolicy } from 'helpers/routes'
import { redirect } from '@roxi/routify'

$redirect(settingsPolicy($user.policy_id))
</script>
