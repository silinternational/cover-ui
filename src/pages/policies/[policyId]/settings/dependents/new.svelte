<script lang="ts">
import { DependentForm } from 'components'
import { addDependent, loadDependents, selectedPolicyDependents } from 'data/dependents'
import { PolicyType, selectedPolicy } from 'data/policies'
import { selectedPolicyId } from 'data/role-policy-selection'
import { settingsPolicy } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

$: policyId = $selectedPolicyId
onMount(() => {
  loadDependents(policyId)
})

let isHouseholdPolicy: boolean

$: isHouseholdPolicy = $selectedPolicy?.type === PolicyType.Household
$: dependents = $selectedPolicyDependents
$: metatags.title = formatPageTitle('Settings > Household > Add Dependent')

const onCancel = () => {
  $goto(settingsPolicy(policyId))
}
const onSubmit = async (event: CustomEvent<string>) => {
  const formData = event.detail
  await addDependent(policyId, formData)
  $goto(settingsPolicy(policyId))
}
</script>

<Page>
  <DependentForm {dependents} {isHouseholdPolicy} on:cancel={onCancel} on:submit={onSubmit} />
</Page>
