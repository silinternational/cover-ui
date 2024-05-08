<script lang="ts">
import type { MenuItem } from './mdc/types'
import { UserAppRole } from 'data/user'
import { getTruncatedNameOfPolicy, Policy, PolicyType } from 'data/policies'
import { roleSelection, recordRoleSelection, selectedPolicyId } from 'data/role-policy-selection'
import { isOlderThanDays } from 'helpers/dates'
import { POLICY_NEW_TEAM } from 'helpers/routes'
import { Button, Menu } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

const ADMIN_ICON = 'gavel'
const HOUSEHOLD_POLICY_ICON = 'family_restroom'
const TEAM_POLICY_ICON = 'business'

export let myPolicies: Policy[]
export let role: UserAppRole

const addTeamPolicyEntry: MenuItem = {
  icon: 'add',
  label: 'Add Team Policy',
  url: POLICY_NEW_TEAM,
}

const hidePolicyEntry = {
  icon: 'visibility_off',
  label: 'Hide Inactive Policies',
  action: () => {
    areInactivePoliciesHidden = true
  },
}

const showPolicyEntry = {
  icon: 'visibility',
  label: 'Show Inactive Policies',
  action: () => {
    areInactivePoliciesHidden = false
  },
}

const dispatch = createEventDispatcher()

let teamPolicyEntries: MenuItem[]
let householdPolicyEntries: MenuItem[]
let menuIsOpen = false
let menuItems: MenuItem[]
let myTeamPolicies: Policy[]
let myHouseholdPolicies: Policy[]
let roleEntries: MenuItem[]
let areInactivePoliciesHidden = false

$: myTeamPolicies = myPolicies.filter(isTeamPolicy)
$: myHouseholdPolicies = myPolicies.filter(isHouseholdPolicy)

$: setInitialRoleSelection(role)

$: buttonText = getButtonText($roleSelection, $selectedPolicyId, myPolicies)
$: buttonIcon = getButtonIcon($roleSelection, $selectedPolicyId, myPolicies)

$: roleEntries = getEntriesForRole(role)
$: teamPolicyEntries = getTeamPolicyEntries(myTeamPolicies)
$: householdPolicyEntries = getHouseholdEntries(myHouseholdPolicies)

$: showOrHidePolicyEntry = areInactivePoliciesHidden ? showPolicyEntry : hidePolicyEntry
$: menuItems = [
  ...roleEntries,
  ...householdPolicyEntries,
  ...teamPolicyEntries,
  addTeamPolicyEntry,
  showOrHidePolicyEntry,
]
$: filteredMenuItems = areInactivePoliciesHidden ? menuItems.filter((item) => !item.isInactive) : menuItems

const selectUserPolicy = (policyId: string) => {
  recordRoleSelection(UserAppRole.Customer)
  dispatch('policy', policyId)
}

const getTeamPolicyEntries = (policies: Policy[]): MenuItem[] => {
  const policyListItems = policies.map((policy: Policy): MenuItem => {
    return {
      icon: TEAM_POLICY_ICON,
      label: getTruncatedNameOfPolicy(policy, 18),
      action: () => selectUserPolicy(policy.id),
      isInactive: isOlderThanDays(policy.updated_at, 30),
    }
  })
  return [{ subtitle: 'Team Policies' }, ...policyListItems]
}

const getHouseholdEntries = (policies: Policy[]): MenuItem[] => {
  const policyListItems = policies.map((policy): MenuItem => {
    return {
      icon: HOUSEHOLD_POLICY_ICON,
      label: getTruncatedNameOfPolicy(policy, 18) || 'Household',
      action: () => selectUserPolicy(policy.id),
      isInactive: false,
    }
  })
  return [{ subtitle: 'Personal Policy' }, ...policyListItems]
}

const selectRole = (role: UserAppRole) => {
  recordRoleSelection(role)
  dispatch('role', role)
}

const getEntriesForRole = (role: UserAppRole): MenuItem[] => {
  const specialEntriesByRole: { [role: string]: MenuItem[] } = {
    Signator: [
      { subtitle: 'admin' },
      { icon: ADMIN_ICON, label: 'Signator', action: () => selectRole(UserAppRole.Signator) },
    ],
    Steward: [
      { subtitle: 'admin' },
      { icon: ADMIN_ICON, label: 'Steward', action: () => selectRole(UserAppRole.Steward) },
    ],
  }
  return specialEntriesByRole[role] || []
}

const setInitialRoleSelection = (actualRole: UserAppRole) => {
  if (actualRole) {
    recordRoleSelection(actualRole)
  }
}

const getButtonText = (userAppRoleSelection: UserAppRole, policyIdSelection: string, myPolicies: Policy[]) => {
  if (userAppRoleSelection !== UserAppRole.Customer) {
    return userAppRoleSelection
  }

  const policy = myPolicies.find((policy) => policy.id === policyIdSelection) as Policy
  if (policy && isTeamPolicy(policy)) {
    return getTruncatedNameOfPolicy(policy)
  }

  return getTruncatedNameOfPolicy(policy, 15) || 'household'
}

const getButtonIcon = (userAppRoleSelection: UserAppRole, policyIdSelection: string, myPolicies: Policy[]) => {
  if (userAppRoleSelection !== UserAppRole.Customer) {
    return ADMIN_ICON
  }

  const policy = myPolicies.find((policy) => policy.id === policyIdSelection)
  if (policy && isTeamPolicy(policy)) {
    return TEAM_POLICY_ICON
  }

  return HOUSEHOLD_POLICY_ICON
}

const isTeamPolicy = (policy: Policy): boolean => policy.type === PolicyType.Team
const isHouseholdPolicy = (policy: Policy): boolean => policy.type === PolicyType.Household
const toggleRoleAndPolicyMenu = () => (menuIsOpen = !menuIsOpen)
</script>

<style>
#role-and-policy-menu-options-container {
  position: absolute;
}

.role-label {
  position: relative;
  top: 10px;
  line-height: 20px;
  background: white;
  z-index: 1;
  width: max-content;
  padding-left: 2px;
  padding-right: 2px;
  margin-left: 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}
</style>

<div class="role-label capitalize mdc-theme--primary fs-12">show policy</div>

<Button class="w-90" outlined prependIcon={buttonIcon} appendIcon="arrow_drop_down" on:click={toggleRoleAndPolicyMenu}>
  {buttonText || ''}
</Button>
<div id="role-and-policy-menu-options-container">
  <Menu bind:menuOpen={menuIsOpen} menuItems={filteredMenuItems} />
</div>
