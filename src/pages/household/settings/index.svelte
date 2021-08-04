<script>
import Breadcrumb from "../../../components/Breadcrumb.svelte";
import { Page, Button } from "@silintl/ui-components";
import { goto } from "@roxi/routify";

// TODO: make this dependent on backend
let accountablePeople = [
  {
    name: "Jeff Smith",
    isYou: true,
    isDependent: false,
    email: "jeff_smith@sil.org",
  },
  {
    name: "Sarah Smith",
    isYou: false,
    isDependent: false,
    email: "sarah_smith@sil.org",
  },
  {
    name: "Junior Smith",
    isYou: false,
    isDependent: true,
  },
]

const goToAddDependent = () => $goto("./dependent")
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
        <br />
        <small>{person.isDependent ? "Dependent" : person.email}</small>
      </li>
    {/each}
  </ul>
  <Button prependIcon="add" on:click={goToAddDependent} outlined>Add dependent</Button>
</Page>
