<script>
import DependentForm from '../../../../components/DependentForm.svelte'
import { goto } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

export let uuid

/** @todo Pull the actual dependent's data from the API / backend */
const dependent =   {
  uuid: '33333333-3333-4333-3333-333333333333',
  name: "Junior Smith",
  isYou: false,
  isDependent: true,
}

const onCancel = () => {
  $goto('../../settings')
}
const onRemove = event => {
  const dependentUuid = event.detail
  console.log('Remove', dependentUuid)
}
const onSubmit = event => {
  const formData = event.detail
  console.log('DependentForm submitted', formData)
  $goto('../../settings')
}
</script>

<Page>
  <DependentForm {dependent} on:cancel={onCancel} on:remove={onRemove} on:submit={onSubmit} />
</Page>
