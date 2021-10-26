<script lang="ts">
import user, { User } from '../authn/user'
import type { Policy } from 'data/policies.ts'
import type { PolicyMember } from 'data/policy-members'
import { Button, Menu, MenuItem } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let myPolicies: Policy[] = []

const dispatch = createEventDispatcher()

$: myCorporatePolicies = myPolicies.filter(isCorporatePolicy)
$: myHouseholdPolicies = myPolicies.filter(isHouseholdPolicy)

let roleEntries: MenuItem[] = []
$: roleEntries = getEntriesForRole($user)
$: corporatePolicyEntries = getCorporatePolicyEntries(myCorporatePolicies)
$: householdPolicyEntries = getHouseholdEntries(myHouseholdPolicies)

$: menuItems = [...roleEntries, ...corporatePolicyEntries, ...householdPolicyEntries]

let menuIsOpen = false
let buttonText = 'Household'

const selectCorporatePolicy = (policy: Policy) => {
  buttonText = 'Corporate' // TODO: Replace with name, when available
  dispatch('policy', policy.id)
}

const selectHouseholdPolicy = (policy: Policy) => {
  buttonText = 'Household' // TODO: Replace with name, when available
  dispatch('policy', policy.id)
}

const getCorporatePolicyEntries = (policies: Policy[]): MenuItem[] => {
  return policies.map((policy: Policy): MenuItem => {
    return {
      icon: 'work',
      label: 'Corporate', // TODO: Replace with name, when available
      action: () => selectCorporatePolicy(policy),
    }
  })
}

const getHouseholdEntries = (policies: Policy[]): MenuItem[] => {
  return policies.map((policy: Policy): MenuItem => {
    return {
      icon: 'family_restroom',
      label: 'Household', // TODO: Replace with name, when available
      action: () => selectHouseholdPolicy(policy),
    }
  })
}

const selectSignator = () => {
  buttonText = 'Signator'
  dispatch('role', 'signator')
}

const selectSteward = () => {
  buttonText = 'Steward'
  dispatch('role', 'steward')
}

const getEntriesForRole = (user: User): MenuItem[] => {
  const specialEntriesByRole = {
    Signator: [{ icon: 'gavel', label: 'Signator', action: selectSignator }],
    Steward: [{ icon: 'gavel', label: 'Steward', action: selectSteward }],
  }
  return specialEntriesByRole[user.app_role] || []
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
