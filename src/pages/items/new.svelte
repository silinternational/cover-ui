<script lang="ts">
import user from '../../authn/user.js'
import { Breadcrumb, ItemForm } from '../../components'
import { addItem } from '../../data/items.js'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

$: policyId = $user.policy_id

const onSubmit = async event => {
  await addItem(policyId, event.detail)

  $goto('/home')
}
</script>

<Page>
  <Breadcrumb />
  <ItemForm {policyId} on:submit={onSubmit} />
</Page>
