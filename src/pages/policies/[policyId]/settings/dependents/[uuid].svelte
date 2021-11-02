<script lang="ts">
import { DependentForm } from 'components'
import { deleteDependent, dependentsByPolicyId, loadDependents, updateDependent } from 'data/dependents'
import { selectedPolicyId } from 'data/role-policy-selection'
import { settingsPolicy } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let uuid: string

$: policyId = $selectedPolicyId
$: policyId && loadDependents(policyId)

$: dependents = $dependentsByPolicyId[policyId] || []
$: dependent = dependents.find((d) => uuid && d.id === uuid)
$: metatags.title = formatPageTitle(`Settings > Household > Edit Dependent`)

const onCancel = () => {
  $goto(settingsPolicy(policyId))
}
const onRemove = async (event: CustomEvent<string>) => {
  const dependentId = event.detail
  await deleteDependent(policyId, dependentId)
  $goto(settingsPolicy(policyId))
}
const onSubmit = async (event: CustomEvent<FormData>) => {
  const formData = event.detail
  await updateDependent(policyId, formData.id, formData)
  $goto(settingsPolicy(policyId))
}
</script>

<Page>
  {#if dependent}
    <DependentForm {dependent} on:cancel={onCancel} on:remove={onRemove} on:submit={onSubmit} />
  {/if}
</Page>
