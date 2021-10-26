<script lang="ts">
import type { UserAppRole } from 'authn/user'
import type { Policy } from 'data/policies.ts'
import { Button, Menu, MenuItem } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let myPolicies: Policy[]
export let role: UserAppRole | undefined
export let selectedPolicyId: string | undefined

const dispatch = createEventDispatcher()

$: myCorporatePolicies = myPolicies.filter(isCorporatePolicy)
$: myHouseholdPolicies = myPolicies.filter(isHouseholdPolicy)

$: tryToUpdateButtonText(role, selectedPolicyId, myCorporatePolicies, myHouseholdPolicies)

let roleEntries: MenuItem[] = []
$: roleEntries = getEntriesForRole(role)
$: corporatePolicyEntries = getCorporatePolicyEntries(myCorporatePolicies)
$: householdPolicyEntries = getHouseholdEntries(myHouseholdPolicies)

$: menuItems = [...roleEntries, ...corporatePolicyEntries, ...householdPolicyEntries]

let menuIsOpen = false
let buttonText = ''

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

const getEntriesForRole = (role: UserAppRole | undefined): MenuItem[] => {
  const specialEntriesByRole = {
    Signator: [{ icon: 'gavel', label: 'Signator', action: selectSignator }],
    Steward: [{ icon: 'gavel', label: 'Steward', action: selectSteward }],
  }
  return specialEntriesByRole[role] || []
}

const isAdminRole = (role: UserAppRole) => ['Signator', 'Steward'].includes(role)

const getDefaultButtonTextForRole = (role: UserAppRole, corporatePolicies: Policy[], householdPolicies: Policy[]) => {
  if (!role) {
    return ''
  }

  if (isAdminRole(role)) {
    return role
  }

  if (corporatePolicies.length > 0) {
    return 'Corporate' // TODO: Replace with default corporate policy's name, when available
  }

  return 'Household' // TODO: Replace with name, when available
}

const tryToUpdateButtonText = (
  role: UserAppRole,
  selectedPolicyId: string | undefined,
  corporatePolicies: Policy[],
  householdPolicies: Policy[]
) => {
  if (!selectedPolicyId) {
    buttonText = getDefaultButtonTextForRole(role, corporatePolicies, householdPolicies)
    return
  }

  const corporatePolicy = corporatePolicies.find((policy) => policy.id === selectedPolicyId)
  if (corporatePolicy) {
    buttonText = 'Corporate' // TODO: Replace with name, when available
    return
  }

  const householdPolicy = householdPolicies.find((policy) => policy.id === selectedPolicyId)
  if (householdPolicy) {
    buttonText = 'Household' // TODO: Replace with name, when available
    return
  }
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
