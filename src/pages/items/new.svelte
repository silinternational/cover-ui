<script lang="ts">
import user from '../../authn/user'
import { Breadcrumb, ItemForm } from '../../components'
import { addItem, submitItem } from '../../data/items'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

$: policyId = $user.policy_id

const onSubmit = async (event) => {
  let item = await addItem(policyId, event.detail)
  await submitItem(policyId, item.id)

  $goto('/home')
}

const onSaveForLater = async (event) => {
  await addItem(policyId, event.detail)

  $goto('/home')
}
</script>

<Page>
  <Breadcrumb />
  <ItemForm {policyId} on:submit={onSubmit} on:save-for-later={onSaveForLater} />
</Page>
