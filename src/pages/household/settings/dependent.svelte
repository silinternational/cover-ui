<script>
import { DependentForm } from '../../../components'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

const onCancel = () => {
  $goto('../settings')
}
const onSubmit = event => {
  const formData = event.detail
  console.log('DependentForm submitted', formData)
}
</script>

<Page>
  <DependentForm on:cancel={onCancel} on:submit={onSubmit} />
</Page>
