<script lang="ts">
import user from '../../../authn/user'
import { addDependent, dependentsByPolicyId, loadDependents, PolicyDependent } from '../../../data/dependents'
import { DependentForm } from '../../../components'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

$: policyId = $user.policy_id as string

$: policyId && loadDependents(policyId)
$: dependents = $dependentsByPolicyId[policyId] || []
const onCancel = () => {
  $goto('/settings/household')
}
const onSubmit = async (event: CustomEvent<string>) => {
  const formData = event.detail
  await addDependent($user.policy_id, formData)
  $goto('/settings/household')
}
</script>

<Page>
  <DependentForm {dependents} on:cancel={onCancel} on:submit={onSubmit} />
</Page>
