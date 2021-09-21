<script lang="ts">
import user from '../../authn/user'
import { Breadcrumb, ItemForm } from '../../components'
import { addItem } from '../../data/items'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

$: policyId = $user.policy_id

const onSubmit = async event => {
  await addItem(policyId, event.detail)

  $goto('/home')
}
const onSaveForLater = async event => {
  /* @todo Save this as an item draft. */
  console.log('Save-for-later form data', event.detail)
  
  $goto('/home')
}
</script>

<Page>
  <Breadcrumb />
  <ItemForm {policyId} on:submit={onSubmit} on:save-for-later={onSaveForLater} />
</Page>
