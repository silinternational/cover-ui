<script>
import user from '../../authn/user'
import { Breadcrumb } from "../../components"
import { dependents, loadDependents } from '../../data/dependents'
import { goto } from "@roxi/routify"
import { Button, IconButton, Page } from "@silintl/ui-components"

// TODO: make this dependent on backend
let householdMembers = [
  {
    uuid: '11111111-1111-4111-1111-111111111111',
    name: "Jeff Smith",
    isYou: true,
    email: "jeff_smith@sil.org",
  },
  {
    uuid: '22222222-2222-4222-2222-222222222222',
    name: "Sarah Smith",
    isYou: false,
    email: "sarah_smith@sil.org",
  },
]

$: loadDependents($user.policy_id)

const edit = uuid => $goto(`/household/settings/dependent/${uuid}`)
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

  <h4>Household members</h4>
  <ul class="accountable-people-list">
    {#each householdMembers as person}
      <li class="accountable-people-list-item">
        {person.name}
        {person.isYou ? "(you)" : ""}
        <br />
        <small>{person.email}</small>
      </li>
    {/each}
  </ul>

  <h4>Dependents</h4>
  <ul class="accountable-people-list">
    {#each $dependents as dependent}
      <li class="accountable-people-list-item">
        {dependent.name}
        <br />
        <small>Dependent</small>
        <span class="edit-button" title="Edit">
          <IconButton icon="edit" ariaLabel="Edit" on:click={() => edit(dependent.uuid)} />
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
