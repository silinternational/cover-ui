<script lang="ts">
import { DependentForm } from 'components'
import { addDependent, dependentsByPolicyId, loadDependents } from 'data/dependents'
import { selectedPolicyId } from 'data/role-policy-selection'
import { settingsPolicy } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

$: policyId = $selectedPolicyId

$: policyId && loadDependents(policyId)
$: dependents = $dependentsByPolicyId[policyId] || []
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
  <DependentForm {dependents} on:cancel={onCancel} on:submit={onSubmit} />
</Page>
