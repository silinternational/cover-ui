<script lang="ts">
import { DependentForm } from 'components'
import {
  deleteDependent,
  loadDependents,
  PolicyDependent,
  selectedPolicyDependents,
  updateDependent,
} from 'data/dependents'
import { PolicyType, selectedPolicy } from 'data/policies'
import { selectedPolicyId } from 'data/role-policy-selection'
import { settingsPolicy } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { goto, metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let uuid: string

let isHouseholdPolicy: boolean

$: isHouseholdPolicy = $selectedPolicy?.type === PolicyType.Household

$: policyId = $selectedPolicyId
onMount(() => {
  loadDependents(policyId)
})

$: dependents = $selectedPolicyDependents
$: dependent = dependents.find((d) => uuid && d.id === uuid)
$: metatags.title = formatPageTitle(`Settings > Household > Edit Dependent`)

const onCancel = () => {
  $goto(settingsPolicy(policyId))
}
const onRemove = async (event: CustomEvent<string>) => {
  const dependentId = event.detail
  await deleteDependent(policyId, dependentId)
  $goto(settingsPolicy(policyId))
}
const onSubmit = async (event: CustomEvent<PolicyDependent>) => {
  const dependent = event.detail
  await updateDependent(policyId, dependent.id, {
    child_birth_year: dependent.child_birth_year,
    country: dependent.country,
    name: dependent.name,
    relationship: dependent.relationship,
  })
  $goto(settingsPolicy(policyId))
}
</script>

<Page>
  {#if dependent}
    <DependentForm {dependent} {isHouseholdPolicy} on:cancel={onCancel} on:remove={onRemove} on:submit={onSubmit} />
  {/if}
</Page>
