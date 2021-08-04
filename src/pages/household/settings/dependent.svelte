<script>
import DependentForm from '../../../components/DependentForm.svelte'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

const onCancel = () => {
  $goto('../settings')
}
const onRemove = event => {
  const dependentUuid = event.detail
  console.log('Remove', dependentUuid)
}
const onSubmit = event => {
  const formData = event.detail
  console.log('DependentForm submitted', formData)
}
</script>

<Page>
  <DependentForm on:cancel={onCancel} on:remove={onRemove} on:submit={onSubmit}></DependentForm>
</Page>
