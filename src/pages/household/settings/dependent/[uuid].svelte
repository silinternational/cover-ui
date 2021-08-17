<script>
import user from '../../../../authn/user'
import DependentForm from '../../../../components/DependentForm.svelte'
import {
  deleteDependent,
  dependentsByPolicyId,
  loadDependents,
  updateDependent
} from '../../../../data/dependents'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let uuid

let dependents = []
$: policyId = $user.policy_id

$: if (policyId) {
  loadDependents(policyId)
}

$: haveLoadedPolicyDependents = $dependentsByPolicyId[policyId] !== undefined
$: if (policyId && haveLoadedPolicyDependents) {
  dependents = $dependentsByPolicyId[policyId]
}

$: dependent = dependents.find(d => uuid && (d.id === uuid))

const onCancel = () => {
  $goto('../../settings')
}
const onRemove = async event => {
  const dependentId = event.detail
  await deleteDependent(dependentId)
  $goto('../../settings')
}
const onSubmit = async event => {
  const formData = event.detail
  await updateDependent(policyId, formData.id, formData)
  $goto('../../settings')
}
</script>

<Page>
  <DependentForm {dependent} on:cancel={onCancel} on:remove={onRemove} on:submit={onSubmit} />
</Page>
