<script lang="ts">
import { Breadcrumb, Description, SearchableSelect } from 'components'
import { entityCodes, loadEntityCodes } from 'data/entityCodes'
import { createPolicy, CreatePolicyRequestBody } from 'data/policies'
import { formatPageTitle } from 'helpers/pageTitle'
import { policyDetails } from 'helpers/routes'
import { assertHas } from '../../validation/assertions'
import { goto, metatags } from '@roxi/routify'
import { Button, TextField, Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

let account = ''
let account_detail = ''
let cost_center = ''
let name = ''
let entity_code = ''
let entityOptions: { [name: string]: string } = {}

onMount(() => $entityCodes.length || loadEntityCodes())

$: metatags.title = formatPageTitle('New Team Policy')
$: $entityCodes.forEach((code) => {
  entityOptions[code.name] = code.code
})

const onCreatePolicy = async () => {
  const formData: CreatePolicyRequestBody = {
    account,
    account_detail,
    cost_center,
    entity_code,
    name,
  }

  validateForm(formData)
  const newPolicy = await createPolicy(formData)
  $goto(policyDetails(newPolicy.id))
}

const validateForm = (formData: CreatePolicyRequestBody) => {
  assertHas(formData.name, 'Please provide a policy name')
  assertHas(formData.entity_code, 'Please provide an entity code')
  assertHas(formData.cost_center, 'Please provide a cost center')
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
    <span class="header">Policy name<span class="required">*</span></span>
    <TextField autofocus bind:value={name} />
  </p>

  <p>
    <span class="header">Entity code<span class="required">*</span></span>
    <SearchableSelect options={entityOptions} placeholder="ABC" on:chosen={(e) => (entity_code = e.detail)} />
  </p>

  <p>
    <span class="header">Cost center<span class="required">*</span></span>
    <TextField placeholder="ABCD12" bind:value={cost_center} />
  </p>

  <p>
    <span class="header">Account<span class="required">*</span></span>
    <TextField placeholder="12345" bind:value={account} />
  </p>

  <p>
    <span class="header">Account Detail</span>
    <TextField placeholder="details" bind:value={account_detail} />
    <Description>Appears in your statements</Description>
  </p>

  <Button raised on:click={onCreatePolicy}>Create policy</Button>
</Page>
