<script lang="ts">
import DependentForm from './forms/DependentForm.svelte'
import { AccountablePersonOptions, selectedAccountablePersonOptions } from 'data/accountablePersons'
import { addDependent, dependentsByPolicyId, initialized, PolicyDependent } from 'data/dependents'
import { policies, Policy, PolicyType } from 'data/policies'
import { membersByPolicyId, selectedPolicyMembers } from 'data/policy-members'
import type { PolicyMember } from 'data/types/policy-members'
import { Dialog, Select } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let policyId: string
export let selectedID: string
export let showError: boolean

let dispatch = createEventDispatcher<{ change: AccountablePersonOptions }>()

let modalOpen = false
let showSelectBox = true

$: policy = $policies.find((policy) => policy.id === policyId) || ({} as Policy)
$: isHouseholdPolicy = policy.type === PolicyType.Household

$: dependents = $dependentsByPolicyId[policyId] || []
$: addPersonOption = createAddPersonOption(policy, $membersByPolicyId[policyId], dependents)

$: accountablePersonsHasBeenPopulated = $initialized && $selectedPolicyMembers.length > 0
$: accountablePersons = [...$selectedAccountablePersonOptions, addPersonOption]

const createAddPersonOption = (
  policy: Policy,
  members: PolicyMember[],
  dependents: PolicyDependent[]
): AccountablePersonOptions => {
  if (!members?.length) {
    // This occurs when the members list hasn't been loaded yet. If we return the [ Add Person ] option it will be
    // accidentally selected as the first item and open the modal
    return { id: '', name: '' }
  }
  if (policy.type === PolicyType.Household) {
    const hasSpouse = dependents?.some((d) => d.relationship === 'Spouse')
    return { id: 'new', name: `[ Add ${!hasSpouse ? 'Spouse or' : ''} Child ]` }
  } else {
    return { id: 'new', name: '[ Add Person ]' }
  }
}

// TODO: On a fresh page load there is a chance that the label on the Select component will overlap with the selected value
const onAccountablePersonChange = (event: CustomEvent<AccountablePersonOptions>): void => {
  const person = event.detail
  selectedID = person.id

  if (person.id === 'new') {
    modalOpen = true
  } else {
    dispatch('change', person)
  }
}

const onModalFormSubmit = async (event: CustomEvent) => {
  if (event.type === 'submit') {
    const depData = event.detail
    showSelectBox = false
    const dependent = await addDependent(policyId, depData)
    selectedID = dependent.id
    showSelectBox = true
    dispatch('change', { id: selectedID, name: dependent.name })
  } else {
    selectedID = accountablePersons[0]?.id
  }

  modalOpen = false
}

const onDialogClosed = () => {
  if (selectedID === 'new') {
    selectedID = accountablePersons[0]?.id
  }
  modalOpen = false
}

const onModalFormCancel = () => {
  modalOpen = false
  selectedID = accountablePersons[0]?.id
}
</script>

{#if showSelectBox}
  {#if accountablePersonsHasBeenPopulated}
    <Select
      required
      {showError}
      label="Accountable Person"
      width="100%"
      on:change={onAccountablePersonChange}
      on:populated
      on:blur
      options={accountablePersons}
      {selectedID}
    />
  {/if}
{/if}

<Dialog.Alert
  open={modalOpen}
  buttons={[]}
  defaultAction="cancel"
  title={isHouseholdPolicy ? 'Add Child or Spouse' : 'Add Person'}
  titleIcon={isHouseholdPolicy ? 'child_care' : 'assignment_ind'}
  on:closed={onDialogClosed}
>
  {#if modalOpen}
    <DependentForm
      class="w-100"
      {dependents}
      {isHouseholdPolicy}
      showActions={false}
      on:submit={onModalFormSubmit}
      on:cancel={onModalFormCancel}
    />
  {/if}
</Dialog.Alert>
