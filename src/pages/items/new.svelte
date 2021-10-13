<script lang="ts">
import user from '../../authn/user'
import { Breadcrumb, ItemForm } from 'components'
import { loadDependents } from 'data/dependents'
import { addItem, submitItem } from 'data/items'
import { loadMembersOfPolicy } from 'data/policy-members'
import { HOME } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

$: policyId = $user.policy_id

$: policyId && loadDependents(policyId)
$: policyId && loadMembersOfPolicy(policyId)
$: metatags.title = formatPageTitle('Items > New')

const onSubmit = async (event: CustomEvent) => {
  let item = await addItem(policyId, event.detail)
  await submitItem(policyId, item.id)

  $goto(HOME)
}

const onSaveForLater = async (event: CustomEvent) => {
  await addItem(policyId, event.detail)

  $goto(HOME)
}
</script>

<Page>
  <Breadcrumb />
  <ItemForm {policyId} on:submit={onSubmit} on:save-for-later={onSaveForLater} />
</Page>
