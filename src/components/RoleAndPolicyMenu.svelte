<script lang="ts">
import type { UserAppRole } from 'authn/user'
import type { Policy } from 'data/policies.ts'
import {
  haveSetRolePolicySelection,
  reactToUrlChanges,
  recordPolicySelection,
  recordRoleSelection,
  RolePolicySelection,
  rolePolicySelection,
} from 'data/role-policy-selection'
import { POLICY_NEW_CORPORATE } from 'helpers/routes'
import { params } from '@roxi/routify'
import { Button, Menu, MenuItem } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let myPolicies: Policy[]
export let role: UserAppRole | undefined

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

$: reactToUrlChanges($params.policyId) // TEMP

$: myCorporatePolicies = myPolicies.filter(isCorporatePolicy)
$: myHouseholdPolicies = myPolicies.filter(isHouseholdPolicy)

$: $haveSetRolePolicySelection || tryToSetInitialRolePolicySelection(role, myCorporatePolicies, myHouseholdPolicies)

$: buttonText = getButtonText($rolePolicySelection, myCorporatePolicies, myHouseholdPolicies)

$: roleEntries = getEntriesForRole(role)
$: corporatePolicyEntries = getCorporatePolicyEntries(myCorporatePolicies)
$: householdPolicyEntries = getHouseholdEntries(myHouseholdPolicies)

$: menuItems = [...roleEntries, ...corporatePolicyEntries, addCorporatePolicyEntry, ...householdPolicyEntries]

const selectPolicy = (policyId: string) => {
  recordPolicySelection(policyId)
  dispatch('policy', policyId)
}

const getCorporatePolicyEntries = (policies: Policy[]): MenuItem[] => {
  return policies.map((policy: Policy): MenuItem => {
    return {
      icon: 'work',
      label: policy.account_detail,
      action: () => selectPolicy(policy.id),
    }
  })
}

const getHouseholdEntries = (policies: Policy[]): MenuItem[] => {
  return policies.map((policy: Policy): MenuItem => {
    return {
      icon: 'family_restroom',
      label: 'Household', // TODO: Replace with name, when available
      action: () => selectPolicy(policy.id),
    }
  })
}

const selectRole = (role: UserAppRole) => {
  recordRoleSelection(role)
  dispatch('role', role)
}

const getEntriesForRole = (role: UserAppRole | undefined): MenuItem[] => {
  const specialEntriesByRole = {
    Signator: [{ icon: 'gavel', label: 'Signator', action: () => selectRole('Signator') }],
    Steward: [{ icon: 'gavel', label: 'Steward', action: () => selectRole('Steward') }],
  }
  return specialEntriesByRole[role] || []
}

const isAdminRole = (role: UserAppRole) => ['Signator', 'Steward'].includes(role)

const tryToSetInitialRolePolicySelection = (
  actualRole: UserAppRole,
  corporatePolicies: Policy[],
  householdPolicies: Policy[]
) => {
  if (actualRole) {
    if (isAdminRole(actualRole)) {
      recordRoleSelection(actualRole)
    } else if (corporatePolicies.length > 0) {
      recordPolicySelection(corporatePolicies[0].id)
    } else if (householdPolicies.length > 0) {
      recordPolicySelection(householdPolicies[0].id)
    }
  }
}

const getButtonText = (
  rolePolicySelection: RolePolicySelection,
  corporatePolicies: Policy[],
  householdPolicies: Policy[]
) => {
  const selectedPolicyId = rolePolicySelection.selectedPolicyId
  if (!selectedPolicyId) {
    return rolePolicySelection.selectedRole || ''
  }

  const corporatePolicy = corporatePolicies.find((policy) => policy.id === selectedPolicyId)
  if (corporatePolicy) {
    return corporatePolicy.account_detail
  }

  return 'Household' // TODO: Replace with name, when available
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
