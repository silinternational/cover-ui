<script lang="ts">
import { DependentForm } from 'components'
import { deleteDependent, loadDependents, selectedPolicyDependents, updateDependent } from 'data/dependents'
import { PolicyType, selectedPolicy } from 'data/policies'
import { selectedPolicyId } from 'data/role-policy-selection'
import { settingsPolicy } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let uuid: string

let isHouseholdPolicy: boolean

$: isHouseholdPolicy = $selectedPolicy?.type === PolicyType.Household

$: policyId = $selectedPolicyId
onMount(() => {
  loadDependents(policyId)
})

$: dependents = $selectedPolicyDependents
$: dependent = dependents.find((d) => uuid && d.id === uuid)
$: metatags.title = formatPageTitle(`Settings > Household > Edit ${isHouseholdPolicy ? 'Dependent' : 'Person'}`)

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
    <h4>Edit {isHouseholdPolicy ? 'Dependent' : 'Person'}</h4>
    <DependentForm
      class="w-50"
      {dependent}
      {isHouseholdPolicy}
      on:cancel={onCancel}
      on:remove={onRemove}
      on:submit={onSubmit}
    />
  {/if}
</Page>
