<script lang="ts">
import type { UserAppRole } from 'authn/user'
import type { Policy } from 'data/policies.ts'
import { RolePolicySelection, rolePolicySelection, selectPolicy, selectRole } from 'data/role-policy-selection'
import { POLICY_NEW_CORPORATE } from 'helpers/routes'
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

$: console.log($rolePolicySelection) // TEMP

$: myCorporatePolicies = myPolicies.filter(isCorporatePolicy)
$: myHouseholdPolicies = myPolicies.filter(isHouseholdPolicy)

$: buttonText = getButtonText($rolePolicySelection, myCorporatePolicies, myHouseholdPolicies)

$: roleEntries = getEntriesForRole(role)
$: corporatePolicyEntries = getCorporatePolicyEntries(myCorporatePolicies)
$: householdPolicyEntries = getHouseholdEntries(myHouseholdPolicies)

$: menuItems = [...roleEntries, ...corporatePolicyEntries, addCorporatePolicyEntry, ...householdPolicyEntries]

const onPolicySelected = (policy: Policy) => {
  selectPolicy(policy.id)
  dispatch('policy', policy.id)
}

const getCorporatePolicyEntries = (policies: Policy[]): MenuItem[] => {
  return policies.map((policy: Policy): MenuItem => {
    return {
      icon: 'work',
      label: policy.account_detail,
      action: () => onPolicySelected(policy),
    }
  })
}

const getHouseholdEntries = (policies: Policy[]): MenuItem[] => {
  return policies.map((policy: Policy): MenuItem => {
    return {
      icon: 'family_restroom',
      label: 'Household', // TODO: Replace with name, when available
      action: () => onPolicySelected(policy),
    }
  })
}

const selectSignator = () => {
  selectRole('Signator')
  dispatch('role', 'signator')
}

const selectSteward = () => {
  selectRole('Steward')
  dispatch('role', 'steward')
}

const getEntriesForRole = (role: UserAppRole | undefined): MenuItem[] => {
  const specialEntriesByRole = {
    Signator: [{ icon: 'gavel', label: 'Signator', action: selectSignator }],
    Steward: [{ icon: 'gavel', label: 'Steward', action: selectSteward }],
  }
  return specialEntriesByRole[role] || []
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
