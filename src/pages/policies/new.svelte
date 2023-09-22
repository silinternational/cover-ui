<script lang="ts">
import { Breadcrumb, Description } from 'components'
import { MAX_INPUT_LENGTH as maxlength } from 'components/const'
import { entityCodes, loadEntityCodes } from 'data/entityCodes'
import { createPolicy } from 'data/policies'
import { formatPageTitle } from 'helpers/pageTitle'
import { policyDetails } from 'helpers/routes'
import { assertHas } from '../../validation/assertions'
import { goto, metatags } from '@roxi/routify'
import { Button, SearchableSelect, TextField, Page, setNotice } from '@silintl/ui-components'
import { onMount } from 'svelte'

let account = ''
let accountDetail = ''
let costCenter = ''
let policyName = ''
let entityCode = ''
let entityOptions: any = {}

onMount(() => $entityCodes.length || loadEntityCodes())

$: metatags.title = formatPageTitle('New Team Policy')
$: $entityCodes
  .filter((e) => e.active && e.code != 'HH')
  .forEach((e) => {
    entityOptions[`${e.code} - ${e.name}`] = e.code
  })
$: entityCodeName = getEntityChoice(entityCode)

const onCreatePolicy = async () => {
  const formData = {
    account,
    accountDetail,
    costCenter,
    entityCode,
    policyName,
  }
  validateForm(formData)
  const newPolicy = await createPolicy(formData)
  $goto(policyDetails(newPolicy.id))
}
const validateForm = (formData: any) => {
  assertHas(formData.policyName, 'Please provide a policy name')
  assertHas(formData.entityCode, 'Please select a valid entity code')
  assertHas(formData.costCenter, 'Please provide a cost center')
  assertHas(formData.account, 'Please provide an account number')
}

const getEntityChoice = (entityCode: string) => {
  const currentEntity = $entityCodes.find((code) => code.code === entityCode)
  const name = currentEntity?.name
  const code = currentEntity?.code
  return name && code ? `${code} - ${name}` : ''
}

const onCheck = (e: CustomEvent) => {
  if (Object.keys(entityOptions).every((key: string) => !key.includes(e.detail))) {
    entityCodeName = ''
    setNotice('Please select a valid entity code')
  }
}
</script>

<Page>
  <Breadcrumb />

  <p>
    <span class="header">Policy name<span class="required-input">*</span></span>
    <TextField {maxlength} required autofocus bind:value={policyName} />
  </p>

  <p>
    <span class="header">Entity<span class="required-input">*</span></span>
    <SearchableSelect
      options={entityOptions}
      bind:choice={entityCodeName}
      on:check={onCheck}
      on:chosen={(e) => (entityCode = e.detail)}
    />
  </p>

  <p>
    <span class="header">Cost center<span class="required-input">*</span></span>
    <TextField {maxlength} required label="ABCD12" bind:value={costCenter} />
  </p>

  <p>
    <span class="header">Account<span class="required-input">*</span></span>
    <TextField {maxlength} required label="12345" bind:value={account} />
  </p>

  <p>
    <span class="header">Account Detail</span>
    <TextField label="details" {maxlength} bind:value={accountDetail} />
    <Description>Appears in your statements</Description>
  </p>

  <Button raised on:click={onCreatePolicy}>Create policy</Button>
</Page>
