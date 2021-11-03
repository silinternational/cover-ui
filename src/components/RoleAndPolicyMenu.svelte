<script lang="ts">
import type { UserAppRole } from '../authn/user'
import type { Policy } from 'data/policies'
import { roleSelection, recordRoleSelection, selectedPolicyId } from 'data/role-policy-selection'
import { POLICY_NEW_CORPORATE } from 'helpers/routes'
import { Button, Menu, MenuItem } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let myPolicies: Policy[]
export let role: UserAppRole

const addCorporatePolicyEntry: MenuItem = {
  icon: 'add',
  label: 'Add corporate policy',
  url: POLICY_NEW_CORPORATE,
}
const dispatch = createEventDispatcher()

let buttonText: string
let corporatePolicyEntries: MenuItem[]
let householdPolicyEntries: MenuItem[]
let menuIsOpen = false
let menuItems: MenuItem[]
let myCorporatePolicies: Policy[]
let myHouseholdPolicies: Policy[]
let roleEntries: MenuItem[]

$: myCorporatePolicies = myPolicies.filter(isCorporatePolicy)
$: myHouseholdPolicies = myPolicies.filter(isHouseholdPolicy)

$: setInitialRoleSelection(role)

$: buttonText = getButtonText($roleSelection, $selectedPolicyId, myPolicies)

$: roleEntries = getEntriesForRole(role)
$: corporatePolicyEntries = getCorporatePolicyEntries(myCorporatePolicies)
$: householdPolicyEntries = getHouseholdEntries(myHouseholdPolicies)

$: menuItems = [...roleEntries, ...corporatePolicyEntries, addCorporatePolicyEntry, ...householdPolicyEntries]

const selectUserPolicy = (policyId: string) => {
  recordRoleSelection('User')
  dispatch('policy', policyId)
}

const getCorporatePolicyEntries = (policies: Policy[]): MenuItem[] => {
  return policies.map((policy: Policy): MenuItem => {
    return {
      icon: 'work',
      label: policy.account_detail,
      action: () => selectUserPolicy(policy.id),
    }
  })
}

const getHouseholdEntries = (policies: Policy[]): MenuItem[] => {
  return policies.map((policy: Policy): MenuItem => {
    return {
      icon: 'family_restroom',
      label: 'Household', // TODO: Replace with name, when available
      action: () => selectUserPolicy(policy.id),
    }
  })
}

const selectRole = (role: UserAppRole) => {
  recordRoleSelection(role)
  dispatch('role', role)
}

const getEntriesForRole = (role: UserAppRole): MenuItem[] => {
  const specialEntriesByRole: { [role: string]: MenuItem[] } = {
    Signator: [{ icon: 'gavel', label: 'Signator', action: () => selectRole('Signator') }],
    Steward: [{ icon: 'gavel', label: 'Steward', action: () => selectRole('Steward') }],
  }
  return specialEntriesByRole[role] || []
}

const isAdminRole = (role: UserAppRole) => ['Signator', 'Steward'].includes(role)

const setInitialRoleSelection = (actualRole: UserAppRole) => {
  if (actualRole && isAdminRole(actualRole)) {
    recordRoleSelection(actualRole)
  } else {
    recordRoleSelection('User')
  }
}

// TODO: Long policy names cause the dropdown and menu to expand in an unexpected way
// Either truncate it or do something more clever
const getButtonText = (userAppRoleSelection: UserAppRole, policyIdSelection: string, myPolicies: Policy[]) => {
  if (userAppRoleSelection !== 'User') {
    return userAppRoleSelection
  }

  const policy = myPolicies.find((policy) => policy.id === policyIdSelection)
  if (policy && isCorporatePolicy(policy)) {
    return policy.account_detail
  }

  return 'Household'
}

const isCorporatePolicy = (policy: Policy): boolean => policy.type === 'Corporate'
const isHouseholdPolicy = (policy: Policy): boolean => policy.type === 'Household'
const toggleRoleAndPolicyMenu = () => (menuIsOpen = !menuIsOpen)
</script>

<style>
#role-and-policy-menu-options-container {
  position: absolute;
}
</style>

<Button appendIcon="arrow_drop_down" on:click={toggleRoleAndPolicyMenu}>{buttonText}</Button>
<div id="role-and-policy-menu-options-container">
  <Menu bind:menuOpen={menuIsOpen} {menuItems} />
</div>
