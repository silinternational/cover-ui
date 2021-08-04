<script>
import Breadcrumb from "../../../components/Breadcrumb.svelte";
import { Button, IconButton, Page } from "@silintl/ui-components";
import { goto } from "@roxi/routify";

// TODO: make this dependent on backend
let accountablePeople = [
  {
    uuid: '11111111-1111-4111-1111-111111111111',
    name: "Jeff Smith",
    isYou: true,
    isDependent: false,
    email: "jeff_smith@sil.org",
  },
  {
    uuid: '22222222-2222-4222-2222-222222222222',
    name: "Sarah Smith",
    isYou: false,
    isDependent: false,
    email: "sarah_smith@sil.org",
  },
  {
    uuid: '33333333-3333-4333-3333-333333333333',
    name: "Junior Smith",
    isYou: false,
    isDependent: true,
  },
]

const edit = uuid => $goto(`./dependent/${uuid}`)
</script>

<style>
#accountable-people-list {
    counter-reset: item;
    list-style-type: none;
    padding-left: 0;
    margin: 10px 0;
}

.accountable-people-list-item {
    border: 0 solid rgba(0, 0, 0, 0.12);
    border-top-width: 1px;
    padding: 10px;
}
.accountable-people-list-item:last-of-type {
  border-bottom-width: 1px;
}
</style>

<Page>
  <Breadcrumb />
  
  <h3>Accountable people</h3>

  <ul id="accountable-people-list">
    {#each accountablePeople as person}
      <li class="accountable-people-list-item">
        {person.name}
        {person.isYou ? "(you)" : ""}
        <IconButton icon="edit" ariaLabel="Edit" on:click={() => edit(person.uuid)} />
        <br />
        <small>{person.isDependent ? "Dependent" : person.email}</small>
      </li>
    {/each}
  </ul>
  <Button prependIcon="add" url="settings/dependent" outlined>Add dependent</Button>
</Page>
