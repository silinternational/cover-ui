<script lang="ts">
import { settingsPolicy } from 'helpers/routes'
import user from '../authn/user'
import { redirect } from '@roxi/routify'

$redirect(settingsPolicy($user.policy_id))
</script>
