<script lang="ts">
import { Breadcrumb } from 'components'
import { MAX_INPUT_LENGTH as maxlength } from 'components/const'
import { entityCodes, loadEntityCodes } from 'data/entityCodes'
import { createPolicy } from 'data/policies'
import { isAdmin } from 'data/user'
import { roleSelection } from 'data/role-policy-selection'
import { formatPageTitle } from 'helpers/pageTitle'
import { POLICIES, POLICY_NEW_TEAM, policyDetails } from 'helpers/routes'
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
let showNameError = false
let showEntityError = false
let showCostCenterError = false
let showAccountError = false

onMount(() => {
  $entityCodes.length || loadEntityCodes()
})

$: metatags.title = formatPageTitle('New Team Policy')
$: $entityCodes
  .filter((e) => e.active && e.code != 'HH')
  .forEach((e) => {
    entityOptions[`${e.code} - ${e.name}`] = e.code
  })
$: entityCodeName = getEntityChoice(entityCode)

$: links = isAdmin($roleSelection)
  ? [{ name: 'Policies', url: POLICIES }]
  : [{ name: 'New Team Policy', url: POLICY_NEW_TEAM }]

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

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    setErrors()
  }
}

const setErrors = () => {
  showNameError = !policyName
  showEntityError = !entityCode
  showCostCenterError = !costCenter
  showAccountError = !account
}
</script>

<Page>
  <Breadcrumb hasHome {links} />
  <Form on:submit={onCreatePolicy}>
    <div>
      <TextField
        class="tw-w-72"
        label="Policy name"
        description="A name for the policy"
        {maxlength}
        required
        bind:value={policyName}
        showError={showNameError}
        on:blur={() => (showNameError = false)}
      />
    </div>

    <div class="tw-my-6">
      <SearchableSelect
        required
        placeholder="Entity"
        class={showEntityError ? 'error-input' : ''}
        options={entityOptions}
        bind:choice={entityCodeName}
        on:check={onCheck}
        on:chosen={(e) => (entityCode = e.detail)}
        on:focus={() => (showEntityError = false)}
      />
    </div>

    <div>
      <TextField
        class="tw-w-72"
        {maxlength}
        required
        description="Use within organization"
        label="Cost center"
        bind:value={costCenter}
        showError={showCostCenterError}
        on:blur={() => (showCostCenterError = false)}
      />
    </div>

    <div>
      <TextField
        class="tw-w-72"
        {maxlength}
        required
        label="Account"
        bind:value={account}
        showError={showAccountError}
        on:blur={() => (showAccountError = false)}
      />
    </div>

    <div>
      <TextField
        class="tw-w-72"
        label="Ledger Entry Description (optional)"
        description="Appears after the Entity, Account, and Cost Center on financial transaction journals"
        maxlength={40}
        bind:value={accountDetail}
      />
    </div>

    <Button on:click={setErrors} on:keydown={onKeydown} raised>Create policy</Button>
  </Form>
</Page>
