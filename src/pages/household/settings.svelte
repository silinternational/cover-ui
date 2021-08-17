<script>
import user from '../../authn/user'
import { Breadcrumb } from "../../components"
import { dependents, initialized as haveLoadedDependents, loadDependents } from '../../data/dependents'
import { loadMembersOfPolicy, membersByPolicyId } from '../../data/policy-members'
import { goto } from "@roxi/routify"
import { Button, IconButton, Page } from "@silintl/ui-components"

let householdMembers = []

$: if ($user.policy_id && !$haveLoadedDependents) {
  loadDependents($user.policy_id)
}

$: if ($user.policy_id) {
  loadMembersOfPolicy($user.policy_id)
}

$: haveLoadedPolicyMembers = $membersByPolicyId[$user.policy_id] !== undefined
$: if ($user.policy_id && haveLoadedPolicyMembers) {
  householdMembers = $membersByPolicyId[$user.policy_id]
}

const edit = id => $goto(`/household/settings/dependent/${id}`)
const isYou = householdMember => householdMember.id === $user.id
</script>

<style>
.accountable-people-list {
  counter-reset: item;
  list-style-type: none;
  padding-left: 0;
  margin: 10px 0;
}

.accountable-people-list-item {
  border: 0 solid rgba(0, 0, 0, 0.12);
  border-top-width: 1px;
  padding: 10px;
  position: relative;
}
.accountable-people-list-item:last-of-type {
  border-bottom-width: 1px;
}

.edit-button {
  position: absolute;
  right: 1rem;
  top: 0.25rem;
  color: rgba(0, 0, 0, 0.5);
}
.muted {
  color: rgba(0, 0, 0, 0.5);
}
</style>

<Page>
  <Breadcrumb />
  
  <h3>Accountable people</h3>

  <ul class="accountable-people-list">
    {#each householdMembers as householdMember}
      <li class="accountable-people-list-item">
        {householdMember.first_name} {householdMember.last_name}
        {isYou(householdMember) ? "(you)" : ""}
        <br />
        <small>{householdMember.email}</small>
      </li>
    {/each}
    {#each $dependents as dependent}
      <li class="accountable-people-list-item">
        {dependent.name}
        <br />
        <small>Dependent</small>
        <span class="edit-button" title="Edit">
          <IconButton icon="edit" ariaLabel="Edit" on:click={() => edit(dependent.id)} />
        </span>
      </li>
    {:else}
      <li class="accountable-people-list-item">
        <i class="muted">None</i>
      </li>
    {/each}
  </ul>
  <Button prependIcon="add" url="settings/dependent" outlined>Add dependent</Button>
</Page>
