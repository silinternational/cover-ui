<script lang="ts">
import user from '../../../authn/user'
import { addDependent, dependentsByPolicyId, loadDependents, PolicyDependent } from 'data/dependents'
import { DependentForm } from 'components'
import { SETTINGS_HOUSEHOLD } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

$: policyId = $user.policy_id as string

$: policyId && loadDependents(policyId)
$: dependents = $dependentsByPolicyId[policyId] || []
$: metatags.title = formatPageTitle('Settings > Household > Add Dependent')

const onCancel = () => {
  $goto(SETTINGS_HOUSEHOLD)
}
const onSubmit = async (event: CustomEvent<string>) => {
  const formData = event.detail
  await addDependent($user.policy_id, formData)
  $goto(SETTINGS_HOUSEHOLD)
}
</script>

<Page>
  <DependentForm {dependents} on:cancel={onCancel} on:submit={onSubmit} />
</Page>
