<script lang="ts">
import user from '../../../authn/user'
import { Breadcrumb, Description, SearchableSelect } from 'components'
import { dependentsByPolicyId, loadDependents } from 'data/dependents'
import { entityCodes, loadEntityCodes } from 'data/entityCodes'
import { policies, updatePolicy, Policy, PolicyType, loadPolicy } from 'data/policies'
import { loadMembersOfPolicy, membersByPolicyId, PolicyMember } from 'data/policy-members'
import { selectedPolicyId } from 'data/role-policy-selection'
import { householdSettingsDependent, householdSettingsNewDependent, settingsPolicy } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Button, TextField, IconButton, Page, setNotice } from '@silintl/ui-components'

const policyData = {} as Policy

$: $entityCodes.length || loadEntityCodes()

$: policyId = $selectedPolicyId

let account = ''
let accountDetail = ''
let entityCode = ''
let entityOptions: any = {}
let householdId = ''
let costCenter = ''
let policyName = ''
let placeholder = 'Your entity of affiliation'
let breadcrumbLinks = [{ name: 'Group Settings', url: settingsPolicy(policyId) }]
metatags.title = formatPageTitle('Group Settings')

$: if (policyId) {
  loadPolicy(policyId)
  loadDependents(policyId)
  loadMembersOfPolicy(policyId)
}

$: $entityCodes.forEach((code) => {
  entityOptions[code.name] = code.code
})
$: dependents = $dependentsByPolicyId[policyId] || []
$: householdMembers = $membersByPolicyId[policyId] || []
$: policy = $policies.find((policy) => policy.id === policyId) || ({} as Policy)

$: policy.account && setAccount()
$: policy.account_detail && setAccountDetail()
$: policy.household_id && setPolicyHouseholdId()
$: policy.cost_center && setPolicyCostCenter()
$: policy.entity_code && setEntityCode()
$: policy.name && setPolicyName()

$: addDependentUrl = householdSettingsNewDependent(policyId)

const setAccount = () => (account = policy.account || '')
const setAccountDetail = () => (accountDetail = policy.account_detail)
const setEntityCode = () => (entityCode = policy.entity_code.code)
const setPolicyHouseholdId = () => (householdId = policy.household_id || '')
const setPolicyCostCenter = () => (costCenter = policy.cost_center || '')
const setPolicyName = () => (policyName = policy.name || '')

const updateAccount = async () => {
  if (account !== policy.account) {
    policyData.account = account
    await callUpdatePolicy()

    setNotice('Your account number has been saved')
  }
}

const updateAccountDetail = async () => {
  if (accountDetail !== policy.account_detail) {
    policyData.account_detail = accountDetail
    await callUpdatePolicy()

    setNotice('Your account detail has been saved')
  }
}

const updateHouseholdId = async () => {
  householdId = householdId.replaceAll(' ', '')
  if (householdId !== policy.household_id) {
    if (isIdValid(householdId)) {
      await callUpdatePolicy()

      setNotice('Your household ID has been saved')
    } else {
      setNotice('Please enter a valid Household ID')
    }
  }
}

const updateCostCenter = async () => {
  costCenter = costCenter.replaceAll(' ', '')
  if (costCenter !== policy.cost_center) {
    if (isIdValid(costCenter)) {
      await callUpdatePolicy()

      setNotice('Your cost center has been saved')
    } else {
      setNotice('Please enter a valid cost center')
    }
  }
}

const updateEntityCode = async (e: CustomEvent<string>) => {
  entityCode = e.detail

  if (entityCode !== policyData.entity_code) {
    await callUpdatePolicy()

    setNotice('Your affiliation has been saved')
  }
}

const updatePolicyName = async () => {
  if (policyName !== policy.name) {
    await callUpdatePolicy()

    setNotice('Your policy name has been saved')
  }
}

const callUpdatePolicy = async () => {
  if ((policy.type = PolicyType.Household)) {
    policyData.household_id = householdId
  }
  if ((policy.type = PolicyType.Corporate)) {
    policyData.account = account
    policyData.cost_center = costCenter
    policyData.entity_code = entityCode
  }
  policyData.account_detail = accountDetail
  policyData.name = policyName

  await updatePolicy(policyId, policyData)
}

const isIdValid = (sanitizedId: string) =>
  sanitizedId.length && sanitizedId.split('').every((digit) => /[0-9]/.test(digit))
const edit = (id: string) => $goto(householdSettingsDependent(policyId, id))
const isYou = (householdMember: PolicyMember) => householdMember.id === $user.id
</script>

<style>
p {
  margin-top: 2rem;
}

.accountable-people-list {
  counter-reset: item;
  list-style-type: none;
  padding-left: 0;
  margin: 10px 0;
}

.accountable-people-list-item {
  border: 0 solid rgba(0, 0, 0, 0.12);
  border-top-width: 1px;
  padding: 10px;
  position: relative;
}
.accountable-people-list-item:last-of-type {
  border-bottom-width: 1px;
}

.edit-button {
  position: absolute;
  right: 1rem;
  top: 0.25rem;
  color: rgba(0, 0, 0, 0.5);
}
.required {
  color: var(--mdc-theme-status-error);
}
</style>

<Page>
  <Breadcrumb links={breadcrumbLinks} />
  {#if policy.type === PolicyType.Household}
    <p>
      <span class="header">Household ID<span class="required">*</span></span>
      <TextField placeholder={'1234567'} bind:value={householdId} on:blur={updateHouseholdId} />
    </p>
  {/if}

  {#if policy.type === PolicyType.Corporate}
    <p>
      <span class="header">Policy name<span class="required">*</span></span>
      <TextField bind:value={policyName} on:blur={updatePolicyName} />
      <Description>Appears in your statements</Description>
    </p>

    <p>
      <span class="header">Affiliation<span class="required">*</span></span>
      <SearchableSelect
        options={entityOptions}
        choice={$entityCodes.find((code) => code.code === entityCode)?.name}
        {placeholder}
        padding={'16px'}
        on:chosen={updateEntityCode}
      />
    </p>
    <p>
      <span class="header">Cost center<span class="required">*</span></span>
      <TextField placeholder={'1234567'} bind:value={costCenter} on:blur={updateCostCenter} />
    </p>

    <p>
      <span class="header">Account<span class="required">*</span></span>
      <TextField placeholder="12345" bind:value={account} on:blur={updateAccount} />
    </p>

    <p>
      <span class="header">Account Detail</span>
      <TextField placeholder="details" bind:value={accountDetail} on:blur={updateAccountDetail} />
    </p>
  {/if}

  <p>
    <span class="header">Accountable people</span>
  </p>
  <ul class="accountable-people-list">
    {#each householdMembers as householdMember}
      <li class="accountable-people-list-item">
        {householdMember.first_name}
        {householdMember.last_name}
        {isYou(householdMember) ? '(you)' : ''}
        <br />
        <small>{householdMember.email}</small>
      </li>
    {/each}
    {#each dependents as dependent}
      <li class="accountable-people-list-item">
        {dependent.name}
        <br />
        <small>Dependent</small>
        <span class="edit-button" title="Edit">
          <IconButton icon="edit" ariaLabel="Edit" on:click={() => edit(dependent.id)} />
        </span>
      </li>
    {/each}
  </ul>
  <Button prependIcon="add" url={addDependentUrl} outlined>Add dependent</Button>
</Page>
