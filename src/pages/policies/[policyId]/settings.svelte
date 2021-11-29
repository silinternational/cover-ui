<script lang="ts">
import user from '../../../authn/user'
import { Breadcrumb, Description, SearchableSelect, Modal, PolicyMemberForm } from 'components'
import { loadDependents, selectedPolicyDependents } from 'data/dependents'
import { entityCodes, loadEntityCodes } from 'data/entityCodes'
import { policies, updatePolicy, Policy, PolicyType, loadPolicy } from 'data/policies'
import { loadMembersOfPolicy, PolicyMember, selectedPolicyMembers } from 'data/policy-members'
import { selectedPolicyId } from 'data/role-policy-selection'
import {
  householdSettingsDependent,
  householdSettingsNewDependent,
  settingsPolicy,
  SETTINGS_PERSONAL,
} from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Button, TextField, IconButton, Page, setNotice, Tooltip } from '@silintl/ui-components'
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
let modalPolicyMember: PolicyMember
let showInviteModal = false

let breadcrumbLinks = [{ name: 'Policy Settings', url: settingsPolicy(policyId) }]
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
$: policy = $policies.find((policy) => policy.id === policyId) || ({} as Policy)

$: setInitialValues(policy)

$: addDependentUrl = householdSettingsNewDependent(policyId)
$: isYou = (member: PolicyMember) => false && $user.id === member.id

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

const onInviteMember = () => {
  modalPolicyMember = {}
  showInviteModal = true
}

const onInviteModalClosed = (event: CustomEvent) => {
  showInviteModal = false
}
const onModalClose = (event: CustomEvent) => {
  console.log('onModalClose', event)
  showInviteModal = false
}
const onModalRemove = (event: CustomEvent<string>) => {
  // TODO: Remove policy member with id from event.detail
  showInviteModal = false
}
const onModalSubmit = (event: CustomEvent) => {
  // TODO: Add policy member from event.detail
  showInviteModal = false
}

const isIdValid = (sanitizedId: string) =>
  sanitizedId.length && sanitizedId.split('').every((digit) => /[0-9]/.test(digit))
const editProfile = () => $goto(SETTINGS_PERSONAL)
const editDependent = (id: string) => $goto(householdSettingsDependent(policyId, id))
const editPerson = (member: PolicyMember) => {
  modalPolicyMember = member
  showInviteModal = true
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

  {#if policy.type === PolicyType.Team}
    <p>
      <span class="header">Policy name<span class="required">*</span></span>
      <TextField bind:value={policyName} on:blur={updatePolicyName} />
      <Description>Appears in your statements</Description>
    </p>

    <p>
      <span class="header">Affiliation<span class="required">*</span></span>
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
    {#each policyMembers as policyMember}
      <li class="accountable-people-list-item">
        <span>
          {policyMember.first_name}
          {policyMember.last_name}
          {isYou(policyMember) ? '(you)' : ''}
          <br />
          <small>{policyMember.email}</small>
        </span>
        <span class="edit-button">
          {#if isYou(policyMember)}
            <Tooltip.Wrapper ariaDescribedBy="edit-profile-button">
              <IconButton icon="person" ariaLabel="Edit your profile" on:click={editProfile} />
            </Tooltip.Wrapper>

            <Tooltip tooltipID="edit-profile-button" positionX="start">Edit your profile</Tooltip>
          {:else}
            <Tooltip.Wrapper ariaDescribedBy={'edit-person-' + policyMember.id}>
              <IconButton icon="edit" ariaLabel="Edit" on:click={() => editPerson(policyMember)} />
            </Tooltip.Wrapper>

            <Tooltip tooltipID={'edit-person-' + policyMember.id} positionX="end">Edit Person</Tooltip>
          {/if}
        </span>
      </li>
    {/each}
    {#each dependents as dependent}
      <li class="accountable-people-list-item">
        <span>
          {dependent.name}
          <br />
          <small>Dependent ({dependent.relationship})</small>
          <br />
          <small>{dependent.country}</small>
        </span>
        <span class="edit-button">
          <Tooltip.Wrapper ariaDescribedBy={'edit-person-' + dependent.id}>
            <IconButton icon="edit" ariaLabel="Edit" on:click={() => editDependent(dependent.id)} />
          </Tooltip.Wrapper>

          <Tooltip tooltipID={'edit-person-' + dependent.id} positionX="end">Edit dependent</Tooltip>
        </span>
      </li>
    {/each}
  </ul>
  <Button prependIcon="add" url={addDependentUrl} outlined>Add dependent</Button>
  {#if policy?.type === PolicyType.Team}
    <Button prependIcon="add" on:click={onInviteMember} outlined>Invite Member</Button>
  {/if}

  <Modal
    open={showInviteModal}
    buttons={[]}
    defaultAction="cancel"
    title="Invite Policy Member"
    titleIcon="assignment_ind"
    on:closed={onInviteModalClosed}
  >
    {#if showInviteModal}
      <PolicyMemberForm
        person={modalPolicyMember}
        on:cancel={onModalClose}
        on:remove={onModalRemove}
        on:submit={onModalSubmit}
      />
    {/if}
  </Modal>
</Page>
