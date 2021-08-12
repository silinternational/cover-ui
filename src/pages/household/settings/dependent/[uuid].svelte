<script>
import { dependents, initialized, loadDependents } from '../../../../data/dependents'
import DependentForm from '../../../../components/DependentForm.svelte'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import user from "../../../../authn/user";

export let uuid

$: $initialized || loadDependents($user.policy_id)
$: dependent = $dependents.find(d => uuid && (d.id === uuid))

const onCancel = () => {
  $goto('../../settings')
}
const onRemove = event => {
  const dependentUuid = event.detail
  console.log('Remove', dependentUuid)
  $goto('../../settings')
}
const onSubmit = event => {
  const formData = event.detail
  console.log('DependentForm submitted', formData)
  $goto('../../settings')
}
</script>

<Page>
  <DependentForm {dependent} on:cancel={onCancel} on:remove={onRemove} on:submit={onSubmit} />
</Page>
