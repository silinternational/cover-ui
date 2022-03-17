<script lang="ts">
import user, { isAdmin } from 'data/user'
import { throwError } from '../../../error'
import { Breadcrumb, Description, SearchableSelect, DependentForm } from 'components'
import { MAX_INPUT_LENGTH as maxlength } from 'components/const'
import type { DependentFormData } from 'components/forms/DependentForm.svelte'
import {
  addDependent,
  loadDependents,
  PolicyDependent,
  selectedPolicyDependents,
  updateDependent,
} from 'data/dependents'
import { entityCodes, loadEntityCodes } from 'data/entityCodes'
import { updatePolicy, Policy, PolicyType, loadPolicy, selectedPolicy } from 'data/policies'
import { invitePolicyMember, loadMembersOfPolicy, selectedPolicyMembers } from 'data/policy-members'
import { roleSelection, selectedPolicyId } from 'data/role-policy-selection'
import type { PolicyMember } from 'data/types/policy-members'
import { POLICIES, policyDetails, settingsPolicy, SETTINGS_PERSONAL } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Button, TextField, IconButton, Page, setNotice, Tooltip, Dialog } from '@silintl/ui-components'
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
}

$: $entityCodes.forEach((code) => {
  entityOptions[code.name] = code.code
})
$: dependents = $selectedPolicyDependents
$: policyMembers = $selectedPolicyMembers
$: policy = $selectedPolicy
$: invites = $selectedPolicy.invites || []

$: setInitialValues(policy)

$: isYou = (member: PolicyMember) => $user.id === member.id
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
  // TODO: Remove policy member with id from event.detail
  throwError('Removeing a policy member is not yet supported')
  showAddDependentModal = false
}
const hasNotBeenInvited = (email: string): boolean =>
  [...invites, ...policyMembers, $user].every((el) => el.email !== email)
const onSubmitModal = async (event: CustomEvent<DependentFormData>) => {
  let { id, name, relationship, country, childBirthYear, permissions, email, message } = event.detail

  if (permissions === 'can-edit') {
    hasNotBeenInvited(email)
      ? await invitePolicyMember(policyId, name, email, message)
      : setNotice('This person is a member of this policy or has already been invited')
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
const editDependent = (dependent: PolicyDependent) => {
  modalTitle = isHouseholdPolicy ? 'Edit Child or Spouse' : 'Edit Person'
  modalData = dependent
  showAddDependentModal = true
}
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
  display: flex;
  justify-content: space-between;
  border: 0 solid rgba(0, 0, 0, 0.12);
  border-top-width: 1px;
  padding: 10px;
  position: relative;
}

.accountable-people-list-item:last-of-type {
  border-bottom-width: 1px;
}

.edit-button {
  top: 0.25rem;
  color: rgba(0, 0, 0, 0.5);
  padding-right: 2rem;
}
</style>

<Page>
  <Breadcrumb links={breadcrumbLinks} />
  {#if policy.type === PolicyType.Household && isAdmin($roleSelection)}
    <p>
      <span class="header">Household ID<span class="required-input">*</span></span>
      <TextField {maxlength} required bind:value={householdId} on:blur={updateHouseholdId} />
    </p>
  {/if}

  {#if policy.type === PolicyType.Team}
    <p>
      <span class="header">Policy name<span class="required-input">*</span></span>
      <TextField {maxlength} required bind:value={policyName} on:blur={updatePolicyName} />
      <Description>Appears in your statements</Description>
    </p>

    <p>
      <span class="header">Affiliation<span class="required-input">*</span></span>
      <SearchableSelect
        options={entityOptions}
        choice={$entityCodes.find((code) => code.code === entityCode)?.name || ''}
        {placeholder}
        padding={'16px'}
        on:chosen={updateEntityCode}
        on:check={warnUserCodeIsNotValid}
      />
    </p>
    <p>
      <span class="header">Cost center<span class="required-input">*</span></span>
      <TextField {maxlength} required bind:value={costCenter} on:blur={updateCostCenter} />
    </p>

    <p>
      <span class="header">Account<span class="required-input">*</span></span>
      <TextField {maxlength} required bind:value={account} on:blur={updateAccount} />
    </p>

    <p>
      <span class="header">Account Detail</span>
      <TextField {maxlength} bind:value={accountDetail} on:blur={updateAccountDetail} />
    </p>
  {/if}

  <p>
    <span class="header">Accountable people</span>
  </p>
  <ul class="accountable-people-list">
    {#each policyMembers as policyMember}
      <li class="accountable-people-list-item">
        <span>
          {policyMember.first_name || ''}
          {policyMember.last_name || ''}
          {isYou(policyMember) ? '(you)' : ''}
          <br />
          <small>{policyMember.email || ''}</small>
          <br />
          <small>{policyMember.country || ''}</small>
        </span>
        <span class="edit-button">
          {#if isYou(policyMember)}
            <Tooltip.Wrapper ariaDescribedBy="edit-profile-button">
              <IconButton icon="person" ariaLabel="Edit your profile" on:click={editProfile} />
            </Tooltip.Wrapper>

            <Tooltip tooltipID="edit-profile-button" positionX="start">Edit your profile</Tooltip>
          {:else}
            <!-- TODO: Figure out how editing a policy member is different from editing a dependent -->
            <!-- <Tooltip.Wrapper ariaDescribedBy={'edit-person-' + policyMember.id}>
              <IconButton icon="edit" ariaLabel="Edit" on:click={() => editPerson(policyMember)} />
            </Tooltip.Wrapper>

            <Tooltip tooltipID={'edit-person-' + policyMember.id} positionX="end">Edit Person</Tooltip> -->
          {/if}
        </span>
      </li>
    {/each}
    {#each dependents as dependent}
      <li class="accountable-people-list-item">
        <span>
          {dependent.name || ''}
          {#if isHouseholdPolicy}
            <br />
            <small>Dependent ({dependent.relationship || '-'})</small>
          {/if}
          <br />
          <small>{dependent.country || ''}</small>
        </span>
        <span class="edit-button">
          <Tooltip.Wrapper ariaDescribedBy={'edit-person-' + dependent.id}>
            <IconButton icon="edit" ariaLabel="Edit" on:click={() => editDependent(dependent)} />
          </Tooltip.Wrapper>

          <Tooltip tooltipID={'edit-person-' + dependent.id} positionX="end">Edit dependent</Tooltip>
        </span>
      </li>
    {/each}
  </ul>

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

  <Button prependIcon="add" on:click={onAddDependent} outlined
    >{isHouseholdPolicy ? 'Add dependent' : 'Add person'}</Button
  >

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
        on:submit={onSubmitModal}
        on:cancel={onCancelModal}
        on:remove={onRemoveModal}
      />
    {/if}
  </Dialog.Alert>
</Page>
