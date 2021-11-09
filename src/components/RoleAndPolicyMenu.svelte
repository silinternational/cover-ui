<script lang="ts">
import { UserAppRole } from '../authn/user'
import { getNameOfPolicy, Policy } from 'data/policies'
import { roleSelection, recordRoleSelection, selectedPolicyId } from 'data/role-policy-selection'
import { POLICY_NEW_TEAM } from 'helpers/routes'
import { Button, Menu, MenuItem } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let myPolicies: Policy[]
export let role: UserAppRole

const addTeamPolicyEntry: MenuItem = {
  icon: 'add',
  label: 'Add team policy',
  url: POLICY_NEW_TEAM,
}
const dispatch = createEventDispatcher()

let buttonText: string
let teamPolicyEntries: MenuItem[]
let householdPolicyEntries: MenuItem[]
let menuIsOpen = false
let menuItems: MenuItem[]
let myTeamPolicies: Policy[]
let myHouseholdPolicies: Policy[]
let roleEntries: MenuItem[]

$: myTeamPolicies = myPolicies.filter(isTeamPolicy)
$: myHouseholdPolicies = myPolicies.filter(isHouseholdPolicy)

$: setInitialRoleSelection(role)

$: buttonText = getButtonText($roleSelection, $selectedPolicyId, myPolicies)

$: roleEntries = getEntriesForRole(role)
$: teamPolicyEntries = getTeamPolicyEntries(myTeamPolicies)
$: householdPolicyEntries = getHouseholdEntries(myHouseholdPolicies)

$: menuItems = [...roleEntries, ...teamPolicyEntries, addTeamPolicyEntry, ...householdPolicyEntries]

const selectUserPolicy = (policyId: string) => {
  recordRoleSelection(UserAppRole.Customer)
  dispatch('policy', policyId)
}

const getTeamPolicyEntries = (policies: Policy[]): MenuItem[] => {
  return policies.map((policy: Policy): MenuItem => {
    return {
      icon: 'work',
      label: getNameOfPolicy(policy),
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
    Signator: [{ icon: 'gavel', label: 'Signator', action: () => selectRole(UserAppRole.Signator) }],
    Steward: [{ icon: 'gavel', label: 'Steward', action: () => selectRole(UserAppRole.Steward) }],
  }
  return specialEntriesByRole[role] || []
}

const isAdminRole = (role: UserAppRole) => [UserAppRole.Signator, UserAppRole.Steward].includes(role)

const setInitialRoleSelection = (actualRole: UserAppRole) => {
  if (actualRole) {
    recordRoleSelection(actualRole)
  }
}

// TODO: Long policy names cause the dropdown and menu to expand in an unexpected way
// Either truncate it or do something more clever
const getButtonText = (userAppRoleSelection: UserAppRole, policyIdSelection: string, myPolicies: Policy[]) => {
  if (userAppRoleSelection !== UserAppRole.Customer) {
    return userAppRoleSelection
  }

  const policy = myPolicies.find((policy) => policy.id === policyIdSelection)
  if (policy && isTeamPolicy(policy)) {
    return getNameOfPolicy(policy)
  }

  return 'Household'
}

const isTeamPolicy = (policy: Policy): boolean => policy.type === 'Team'
const isHouseholdPolicy = (policy: Policy): boolean => policy.type === 'Household'
const toggleRoleAndPolicyMenu = () => (menuIsOpen = !menuIsOpen)
</script>

<style>
#role-and-policy-menu-options-container {
  position: absolute;
}
</style>

<Button appendIcon="arrow_drop_down" on:click={toggleRoleAndPolicyMenu}>{buttonText || ''}</Button>
<div id="role-and-policy-menu-options-container">
  <Menu bind:menuOpen={menuIsOpen} {menuItems} />
</div>
