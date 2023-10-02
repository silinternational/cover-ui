<script lang="ts">
import { Breadcrumb } from 'components'
import { MAX_INPUT_LENGTH as maxlength } from 'components/const'
import { entityCodes, loadEntityCodes } from 'data/entityCodes'
import { createPolicy } from 'data/policies'
import { formatPageTitle } from 'helpers/pageTitle'
import { policyDetails } from 'helpers/routes'
import { assertHas } from '../../validation/assertions'
import { goto, metatags } from '@roxi/routify'
import { Button, SearchableSelect, TextField, Page, setNotice, Form } from '@silintl/ui-components'
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

<style>
/* TODO use tailwind classes for this */
.extra-margin {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>

<Page>
  <Breadcrumb />
  <Form on:submit={onCreatePolicy}>
    <div>
      <TextField
        class="w-22"
        label="Policy name"
        description="A name for the policy"
        {maxlength}
        required
        bind:value={policyName}
      />
    </div>

    <div class="extra-margin">
      <SearchableSelect
        required
        placeholder="Entity"
        options={entityOptions}
        bind:choice={entityCodeName}
        on:check={onCheck}
        on:chosen={(e) => (entityCode = e.detail)}
      />
    </div>

    <div>
      <TextField
        class="w-22"
        {maxlength}
        required
        description="Use within organization"
        label="Cost center"
        bind:value={costCenter}
      />
    </div>

    <div>
      <TextField class="w-22" {maxlength} required label="Account" bind:value={account} />
    </div>

    <div>
      <TextField
        class="w-22"
        label="Ledger Entry Description (optional)"
        description="Appears after the Entity, Account, and Cost Center on financial transaction journals"
        maxlength={40}
        bind:value={accountDetail}
      />
    </div>

    <Button raised>Create policy</Button>
  </Form>
</Page>
