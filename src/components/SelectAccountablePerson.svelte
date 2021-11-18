<script lang="ts">
import DependentForm from './forms/DependentForm.svelte'
import Modal from './mdc/Modal.svelte'
import { AccountablePersonOptions, getDependentOptions, getPolicyMemberOptions } from 'data/accountablePersons'
import { addDependent, dependentsByPolicyId, PolicyDependent } from 'data/dependents'
import { policies, Policy, PolicyType } from 'data/policies'
import { membersByPolicyId } from 'data/policy-members'
import { Select } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let policyId: string
export let selectedID: string

let dispatch = createEventDispatcher<{ change: AccountablePersonOptions }>()

let modalOpen = false
let showSelectBox = true

$: policy = $policies.find((policy) => policy.id === policyId) || ({} as Policy)
$: isHouseholdPolicy = policy.type === PolicyType.Household

$: dependents = $dependentsByPolicyId[policyId] || []
$: dependentOptions = getDependentOptions(dependents)
$: policyMemberOptions = getPolicyMemberOptions($membersByPolicyId[policyId] || [])
$: addPersonOption = createAddPersonOption(policy, dependents)

$: accountablePersons = [...policyMemberOptions, ...dependentOptions, addPersonOption]

const createAddPersonOption = (policy: Policy, dependents: PolicyDependent[]): AccountablePersonOptions => {
  if (policy.type === PolicyType.Household) {
    const hasSpouse = dependents?.some((d) => d.relationship === 'Spouse')
    return { id: 'new', name: `[ Add ${!hasSpouse ? 'Spouse or' : ''} Child ]` }
  } else {
    return { id: 'new', name: '[ Add Person ]' }
  }
}

const onAccountablePersonChange = (event: CustomEvent<AccountablePersonOptions>): void => {
  const person = event.detail
  selectedID = person.id

  if (person.id === 'new') {
    modalOpen = true
  } else {
    dispatch('change', event.detail)
  }
}

const onModalFormSubmit = async (event: CustomEvent) => {
  if (event.type === 'submit') {
    const depData = event.detail
    // TODO: Figure out why adding items to this select box causes it to throw MDC errors
    // For now it can be resolve by "turning it off and on again"
    showSelectBox = false
    const dependent = await addDependent(policyId, depData)
    selectedID = dependent.id
    showSelectBox = true
  } else {
    selectedID = accountablePersons[0]?.id
  }

  modalOpen = false
}

const onDialogClosed = (event: CustomEvent) => {
  if (selectedID === 'new') {
    selectedID = accountablePersons[0].id
  }
  modalOpen = false
}

const onModalFormCancel = (event: CustomEvent) => {
  modalOpen = false
  selectedID = accountablePersons[0].id
}
</script>

{#if showSelectBox}
  <Select
    label="Assigned To"
    on:change={onAccountablePersonChange}
    on:populated
    options={accountablePersons}
    {selectedID}
  />
{/if}

<Modal
  open={modalOpen}
  buttons={[]}
  defaultAction="cancel"
  title="Add Dependent"
  titleIcon="child_care"
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
</Modal>