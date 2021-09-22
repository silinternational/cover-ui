<script lang="ts">
import user from '../../../authn/user'
import { addDependent } from '../../../data/dependents'
import { DependentForm } from '../../../components'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

const onCancel = () => {
  $goto('/settings/household')
}
const onSubmit = async (event) => {
  const formData = event.detail
  await addDependent($user.policy_id, formData)
  $goto('/settings/household')
}
</script>

<Page>
  <DependentForm on:cancel={onCancel} on:submit={onSubmit} />
</Page>
