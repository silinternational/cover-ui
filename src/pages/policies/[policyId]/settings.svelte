<script lang="ts">
import user, { isAdmin } from 'data/user'
import { AccountablePeopleList, Breadcrumb, DependentForm, RemoveMemberModal } from 'components'
import { MAX_INPUT_LENGTH as maxlength } from 'components/const'
import type { DependentFormData } from 'components/forms/DependentForm.svelte'
import {
  addDependent,
  deleteDependent,
  loadDependents,
  PolicyDependent,
  selectedPolicyDependents,
  updateDependent,
} from 'data/dependents'
import { entityCodes, loadEntityCodes } from 'data/entityCodes'
import { assignItems, loadItems } from 'data/items'
import { updatePolicy, Policy, PolicyType, loadPolicy, selectedPolicy } from 'data/policies'
import { deletePolicyMember, invitePolicyMember, loadMembersOfPolicy, selectedPolicyMembers } from 'data/policy-members'
import { roleSelection, selectedPolicyId } from 'data/role-policy-selection'
import type { PolicyMember } from 'data/types/policy-members'
import { ITEMS, POLICIES, policyDetails, settingsPolicy, SETTINGS_PERSONAL } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Button, SearchableSelect, TextField, Page, setNotice, Dialog } from '@silintl/ui-components'
import { onMount } from 'svelte'

const policyData = {} as Policy

onMount(() => $entityCodes.length || loadEntityCodes())

$: policyId = $selectedPolicyId

let account = ''
let accountDetail = ''
let entityCode = ''
let entityOptions: any = {}
let householdId = ''
let costCenter = ''
let policyName = ''
let placeholder = 'Your entity of affiliation'
let modalData: PolicyDependent
let showAddDependentModal = false
let modalTitle = 'Add Person'
let removeModalIsOpen = false
let selectedPolicyMember: PolicyMember

$: breadcrumbLinks = isAdmin($roleSelection)
  ? [
      { name: 'Policies', url: POLICIES },
      { name: policy.name, url: policyDetails(policyId) },
      { name: 'Policy Settings', url: settingsPolicy(policyId) },
    ]
  : [{ name: 'Policy Settings', url: settingsPolicy(policyId) }]

metatags.title = formatPageTitle('Policy Settings')

$: if (policyId) {
  loadPolicy(policyId)
  loadDependents(policyId)
  loadMembersOfPolicy(policyId)
  loadItems(policyId) //needed by DependentForm
}

$: $entityCodes.forEach((code) => {
  entityOptions[`${code.code} - ${code.name}`] = code.code
})
$: dependents = $selectedPolicyDependents
$: policyMembers = $selectedPolicyMembers
$: policy = $selectedPolicy
$: invites = $selectedPolicy.invites || []

$: setInitialValues(policy)

$: isHouseholdPolicy = policy.type === PolicyType.Household

function setInitialValues(policy: Policy): void {
  account = policy.account || ''
  accountDetail = policy.account_detail || ''
  entityCode = policy.entity_code?.code || ''
  householdId = policy.household_id || ''
  costCenter = policy.cost_center || ''
  policyName = policy.name || ''
}

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
  if (householdId !== policy.household_id || !householdId) {
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
    await callUpdatePolicy()

    setNotice('Your cost center has been saved')
  }
}

const warnUserCodeIsNotValid = (e: CustomEvent<string>) => {
  !entityOptions[e.detail] && setNotice('Please select a valid entity code')
}

const updateEntityCode = async (e: CustomEvent<string>) => {
  entityCode = e.detail

  if (entityCode !== policy.entity_code?.code) {
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
  if (policy.type === PolicyType.Household) {
    policyData.household_id = householdId
  }
  if (policy.type === PolicyType.Team) {
    policyData.account = account
    policyData.cost_center = costCenter
    policyData.entity_code = entityCode
  }
  policyData.account_detail = accountDetail
  policyData.name = policyName

  await updatePolicy(policyId, policyData)
}

const onAddDependent = () => {
  modalData = {} as PolicyDependent
  modalTitle = isHouseholdPolicy ? 'Add Child or Spouse' : 'Add Person'
  showAddDependentModal = true
}

const onDependentModalClosed = (event: CustomEvent) => {
  showAddDependentModal = false
}
const onCancelModal = (event: CustomEvent) => {
  showAddDependentModal = false
}
const onRemoveModal = (event: CustomEvent<string>) => {
  deleteDependent(policyId, event.detail)
  showAddDependentModal = false
}
const hasNotBeenInvited = (email: string): boolean =>
  [...invites, ...policyMembers, $user].every((el) => el.email !== email)
const onSubmitModal = async (event: CustomEvent<DependentFormData>) => {
  let { id, name, relationship, country, childBirthYear, permissions, email, message } = event.detail

  if (permissions === 'can-edit') {
    hasNotBeenInvited(email)
      ? await invitePolicyMember(policyId, name, email, message)
      : setNotice(`This person is a member of your ${policy.type.toLowerCase()} policy or has already been invited`)
  } else if (id) {
    await updateDependent(policyId, id, {
      name,
      relationship,
      country,
      childBirthYear,
    })
  } else {
    await addDependent(policyId, {
      name,
      relationship,
      country,
      childBirthYear,
    })
  }

  showAddDependentModal = false
}

const isIdValid = (id: string): boolean => /^[0-9]+$/.test(id)
const editProfile = () => $goto(SETTINGS_PERSONAL)
const editDependent = (e: CustomEvent) => {
  modalTitle = isHouseholdPolicy ? 'Edit Child or Spouse' : 'Edit Person'
  modalData = e.detail
  showAddDependentModal = true
}

const onRemove = (policyUserId: string) => deletePolicyMember(policyUserId)

const onAssign = (e: CustomEvent) => {
  assignItems(e.detail, policyId, selectedPolicyMember.id)
}

const getEntityChoice = (entityCode: string) => {
  const currentEntity = $entityCodes.find((code) => code.code === entityCode)
  const name = currentEntity?.name
  const code = currentEntity?.code
  return name && code ? `${code} - ${name}` : ''
}

const onDeleteMember = (e: CustomEvent) => {
  selectedPolicyMember = e.detail
  removeModalIsOpen = true
}
</script>

<style>
/* TODO use tailwind classes for these */
div {
  margin-top: 1rem;
}
.extra-margin {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>

<Page>
  <Breadcrumb links={breadcrumbLinks} />
  {#if policy.type === PolicyType.Household && isAdmin($roleSelection)}
    <div>
      <TextField {maxlength} label="Household ID" required bind:value={householdId} on:blur={updateHouseholdId} />
    </div>
  {/if}

  {#if policy.type === PolicyType.Team}
    <div>
      <TextField
        required
        {maxlength}
        description="Appears in your statements"
        label="Policy name"
        bind:value={policyName}
        on:blur={updatePolicyName}
      />
    </div>

    <div class="extra-margin">
      <SearchableSelect
        required
        options={entityOptions}
        choice={getEntityChoice(entityCode)}
        {placeholder}
        padding={'16px'}
        on:chosen={updateEntityCode}
        on:check={warnUserCodeIsNotValid}
      />
    </div>

    <div>
      <TextField label="Cost center" {maxlength} required bind:value={costCenter} on:blur={updateCostCenter} />
    </div>

    <div>
      <TextField label="Account" {maxlength} required bind:value={account} on:blur={updateAccount} />
    </div>

    <div>
      <TextField
        label="Account Detail (optional)"
        {maxlength}
        bind:value={accountDetail}
        on:blur={updateAccountDetail}
      />
    </div>
  {/if}

  <AccountablePeopleList
    {policyMembers}
    {dependents}
    {isHouseholdPolicy}
    userID={$user.id}
    on:deleteMember={onDeleteMember}
    on:editDependent={editDependent}
    on:editProfile={editProfile}
  />

  <p>
    <span class="header">Invites</span>
  </p>
  <ul class="accountable-people-list">
    {#each invites as invite}
      <li class="accountable-people-list-item">
        <span>
          {invite.name || ''}
          <br />
          <small>{invite.email || ''}</small>
        </span>
      </li>
    {/each}
  </ul>

  <Button prependIcon="add" on:click={onAddDependent} outlined>
    {isHouseholdPolicy ? 'Add dependent' : 'Add person'}
  </Button>

  <Dialog.Alert
    open={showAddDependentModal}
    buttons={[]}
    defaultAction="cancel"
    title={modalTitle}
    titleIcon={isHouseholdPolicy ? 'child_care' : 'assignment_ind'}
    on:closed={onDependentModalClosed}
  >
    {#if showAddDependentModal}
      <DependentForm
        class="w-100 mw-500"
        dependent={modalData}
        {dependents}
        {isHouseholdPolicy}
        {policyId}
        on:submit={onSubmitModal}
        on:cancel={onCancelModal}
        on:remove={onRemoveModal}
      />
    {/if}
  </Dialog.Alert>

  <RemoveMemberModal
    policyMember={selectedPolicyMember}
    {policyId}
    open={removeModalIsOpen}
    on:remove={() => onRemove(selectedPolicyMember.policy_user_id)}
    on:gotoItems={() => $goto(ITEMS)}
    on:cancel={() => (removeModalIsOpen = false)}
    on:closed={() => (removeModalIsOpen = false)}
    on:assign={onAssign}
  />
</Page>
