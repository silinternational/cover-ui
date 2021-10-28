<script lang="ts">
import { Breadcrumb, Description } from 'components'
import { createPolicy } from 'data/policies'
import { formatPageTitle } from 'helpers/pageTitle'
import { policyDetails } from 'helpers/routes'
import { assertHas } from '../../validation/assertions'
import { goto, metatags } from '@roxi/routify'
import { Button, TextField, Page } from '@silintl/ui-components'

let account = ''
let costCenter = ''
let groupName = ''
let entityCode = ''

$: metatags.title = formatPageTitle('New Corporate Policy')

const onCreatePolicy = async () => {
  const formData = {
    account,
    costCenter,
    entityCode,
    groupName,
  }
  validateForm(formData)
  const newPolicy = await createPolicy(formData)
  $goto(policyDetails(newPolicy.id))
}
const validateForm = (formData) => {
  assertHas(formData.groupName, 'Please provide a group name')
  assertHas(formData.entityCode, 'Please provide an entity code')
  assertHas(formData.costCenter, 'Please provide a cost center')
  assertHas(formData.account, 'Please provide an account number')
}
</script>

<style>
.required {
  color: var(--mdc-theme-status-error);
}
</style>

<Page>
  <Breadcrumb />

  <p>
    <span class="header">Group name<span class="required">*</span></span>
    <TextField autofocus bind:value={groupName} />
    <Description>Appears in your statements</Description>
  </p>

  <p>
    <span class="header">Entity code<span class="required">*</span></span>
    <TextField placeholder="ABC" bind:value={entityCode} />
  </p>

  <p>
    <span class="header">Cost center<span class="required">*</span></span>
    <TextField placeholder="ABCD12" bind:value={costCenter} />
  </p>

  <p>
    <span class="header">Account<span class="required">*</span></span>
    <TextField placeholder="12345" bind:value={account} />
  </p>

  <Button raised on:click={onCreatePolicy}>Create policy</Button>
</Page>
