<script>
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import DependentForm from '../../../components/DependentForm.svelte'

const onCancel = () => {
  $goto('../settings')
}
</script>

<Page>
  <DependentForm on:cancel={onCancel}></DependentForm>
</Page>
