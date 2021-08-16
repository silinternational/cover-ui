<script>
import user from '../../../../authn/user'
import DependentForm from '../../../../components/DependentForm.svelte'
import {
  deleteDependent,
  dependents,
  initialized,
  loadDependents,
  updateDependent
} from '../../../../data/dependents'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let uuid

$: $initialized || loadDependents($user.policy_id)
$: dependent = $dependents.find(d => uuid && (d.id === uuid))

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
  await updateDependent(formData.id, formData)
  $goto('../../settings')
}
</script>

<Page>
  <DependentForm {dependent} on:cancel={onCancel} on:remove={onRemove} on:submit={onSubmit} />
</Page>
