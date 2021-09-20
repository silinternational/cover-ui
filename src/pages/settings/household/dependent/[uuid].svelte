<script lang="ts">
import user from '../../../../authn/user'
import { DependentForm } from '../../../../components'
import {
  deleteDependent,
  dependentsByPolicyId,
  loadDependents,
  updateDependent
} from '../../../../data/dependents'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let uuid

$: policyId = $user.policy_id
$: if (policyId) {
  loadDependents(policyId)
}

$: dependents = $dependentsByPolicyId[policyId] || []
$: dependent = dependents.find(d => uuid && (d.id === uuid))

const onCancel = () => {
  $goto('/settings/household')
}
const onRemove = async event => {
  const dependentId = event.detail
  await deleteDependent(policyId, dependentId)
  $goto('/settings/household')
}
const onSubmit = async event => {
  const formData = event.detail
  await updateDependent(policyId, formData.id, formData)
  $goto('/settings/household')
}
</script>

<Page>
  {#if dependent}
    <DependentForm {dependent} on:cancel={onCancel} on:remove={onRemove} on:submit={onSubmit} />
  {/if}
</Page>
