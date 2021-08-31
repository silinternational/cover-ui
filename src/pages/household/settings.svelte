<script>
import user from '../../authn/user'
import { Breadcrumb } from "../../components"
import { dependentsByPolicyId, loadDependents } from '../../data/dependents'
import { policies, updatePolicy, init } from '../../data/policies'
import { loadMembersOfPolicy, membersByPolicyId } from '../../data/policy-members'
import { goto } from "@roxi/routify"
import { Button, TextField, IconButton, Page, Snackbar, setNotice } from "@silintl/ui-components"

const policyData = {}
const affiliations = {
  'WBT': 'Wycliffe USA',
  'SIL': 'SIL International'
}

let householdId = ''
let affiliationChoice = ''

$: policyId = $user.policy_id
$: if (policyId) {
  loadDependents(policyId)
  loadMembersOfPolicy(policyId)
}

$: dependents = $dependentsByPolicyId[policyId] || []
$: householdMembers = $membersByPolicyId[policyId] || []
$: $policies.length || init()
$: policy = $policies.find(policy => policy.id === policyId) || {}
$: policy.household_id && setPolicyHouseholdId()
$: policy.entity_code && setAffiliation()

const setAffiliation = () => affiliationChoice = affiliations[policy.entity_code]

const setPolicyHouseholdId = () => householdId = policy.household_id || ''

const updateHouseholdId = async () => {
  householdId = householdId.replaceAll(' ', '')
  if(householdId !== policy.household_id) {
    if(isIdValid(householdId)) {
      await callUpdatePolicy()

      setNotice('Your household ID has been saved')
    } else {
      setNotice('Please enter a valid Household ID')
      setPolicyHouseholdId()
    }
  }
}

const updateAffiliation = async () => {
  for (const [key, value] of Object.entries(affiliations)){
    if(affiliationChoice === value && affiliationChoice !== policyData.entity_code) {

      policyData.entity_code = key

      await callUpdatePolicy()
      
      setNotice('Your affiliation has been saved')
    }
  }
}

const callUpdatePolicy = async () => {
  policyData.household_id = householdId

  await updatePolicy(policyId, policyData)
}

const isIdValid = sanitizedId => sanitizedId.length && sanitizedId.split('').every(digit => /[0-9]/.test(digit))
const edit = id => $goto(`/household/settings/dependent/${id}`)
const isYou = householdMember => householdMember.id === $user.id
</script>

<style>
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


/* datalist styling */
*, *::before, *::after {
  box-sizing: border-box;
}

.custom-field {
  font-size: 14px;
  position: relative;
  --field-padding: 12px;
  border-top: 20px solid transparent;
}

.custom-field input {
  border-radius: 8px;
  border: 1px solid gray;
  width: 240px;
  padding: var(--field-padding) 0 var(--field-padding) var(--field-padding);
}

.custom-field .placeholder {
  position: absolute;
  bottom: -45px;
  top: 22px;  
  transform: translateY(-50%);
  color: #aaa;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  left: var(--field-padding);
  width: calc(100% - (var(--field-padding) * 2));
  transition: 
    top 0.3s ease,
    color 0.3s ease,
    font-size 0.3s ease;
}

.custom-field input:not(:placeholder-shown) + .placeholder,
.custom-field input:focus + .placeholder {
  top: 4px;
  font-size: 10px;
  color: #222;
}
</style>

<Page>
  <Breadcrumb />

  <h3 class="ml-1 mt-3">Household ID<span class="required">*</span></h3>
  <p>
    <TextField placeholder={'1234567'} autofocus bind:value={householdId} on:blur={updateHouseholdId} />
  </p>
  
  <h3 class="ml-1 mt-3" >Affiliation<span class="required">*</span></h3>
  <label class="custom-field">
    <input class="fs-14" list="affiliations" name="affiliations-choice" placeholder="&nbsp;" bind:value={affiliationChoice} on:change={updateAffiliation}/>
    <span class="placeholder">Your entity of affiliation</span>
  </label>

  <datalist id="affiliations">
    {#each Object.values(affiliations) as affiliation}
      <option value={affiliation}>  
    {/each}
  </datalist>
  
  <h3 class="mt-3">Accountable people</h3>

  <ul class="accountable-people-list">
    {#each householdMembers as householdMember}
      <li class="accountable-people-list-item">
        {householdMember.first_name} {householdMember.last_name}
        {isYou(householdMember) ? "(you)" : ""}
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
  <Button prependIcon="add" url="settings/dependent" outlined>Add dependent</Button>

  <Snackbar/>
</Page>
