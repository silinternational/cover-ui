<script lang="ts">
import user from '../../authn/user'
import { Breadcrumb, SearchableSelect } from 'components'
import { dependentsByPolicyId, loadDependents } from 'data/dependents'
import { policies, updatePolicy, affiliations, Policy, loadPolicy } from 'data/policies'
import { loadMembersOfPolicy, membersByPolicyId, PolicyMember } from 'data/policy-members'
import { SETTINGS_HOUSEHOLD, householdSettingsDependent } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Button, TextField, IconButton, Page, setNotice } from '@silintl/ui-components'

const policyData = {} as Policy

let affiliationChoice = ''
let householdId = ''
let costCenter = ''
let placeholder = 'Your entity of affiliation'
let breadcrumbLinks = [{ name: 'Group Settings', url: SETTINGS_HOUSEHOLD }]
metatags.title = formatPageTitle('Group Settings')

$: policyId = $user.policy_id
$: if (policyId) {
  loadPolicy(policyId)
  loadDependents(policyId)
  loadMembersOfPolicy(policyId)
}

$: dependents = $dependentsByPolicyId[policyId] || []
$: householdMembers = $membersByPolicyId[policyId] || []
$: policy = $policies.find((policy) => policy.id === policyId) || ({} as Policy)
$: policy.household_id && setPolicyHouseholdId()
$: policy.cost_center && setPolicyCostCenter()
$: policy.entity_code && setAffiliation()

const setAffiliation = () => (affiliationChoice = $affiliations[policy.entity_code])
const setPolicyHouseholdId = () => (householdId = policy.household_id || '')
const setPolicyCostCenter = () => (costCenter = policy.cost_center || '')

const updateHouseholdId = async () => {
  householdId = householdId.replaceAll(' ', '')
  if (householdId !== policy.household_id) {
    if (isIdValid(householdId)) {
      await callUpdatePolicy(householdId)

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
      await callUpdatePolicy(householdId, costCenter)

      setNotice('Your cost center has been saved')
    } else {
      setNotice('Please enter a valid cost center')
    }
  }
}

const updateAffiliation = async (e: CustomEvent<string>) => {
  const choice = e.detail

  if (choice !== policyData.entity_code) {
    await callUpdatePolicy(householdId, costCenter, choice)

    setNotice('Your affiliation has been saved')
  }
}

const callUpdatePolicy = async (id: string, costCenter?: string, affiliation?: string) => {
  policyData.household_id = id
  affiliation && (policyData.entity_code = affiliation)
  costCenter && (policyData.cost_center = costCenter)

  await updatePolicy(policyId, policyData)
}

const isIdValid = (sanitizedId: string) =>
  sanitizedId.length && sanitizedId.split('').every((digit) => /[0-9]/.test(digit))
const edit = (id: string) => $goto(householdSettingsDependent(id))
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

  <p>
    <span class="header">Household ID<span class="required">*</span></span>
    <TextField placeholder={'1234567'} autofocus bind:value={householdId} on:blur={updateHouseholdId} />
  </p>

  {#if policy.type === 'Corporate'}
    <p>
      <span class="header">Affiliation<span class="required">*</span></span>
      <SearchableSelect
        options={$affiliations}
        choice={affiliationChoice}
        {placeholder}
        padding={'16px'}
        on:chosen={updateAffiliation}
      />
    </p>
    <p>
      <span class="header">Cost center<span class="required">*</span></span>
      <TextField placeholder={'1234567'} bind:value={costCenter} on:blur={updateCostCenter} />
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
  <Button prependIcon="add" url="household/dependent" outlined>Add dependent</Button>
</Page>
