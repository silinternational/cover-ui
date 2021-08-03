<script>
import Breadcrumb from "../../../components/Breadcrumb.svelte";
import { Page, Button } from "@silintl/ui-components";
import { goto } from "@roxi/routify";

// TODO: make this dependent on backend
let members = [
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
</script>

<style>
#members-page {
    margin-top: 30px;
}

#members-list {
    counter-reset: item;
    list-style-type: none;
    padding-left: 0;
    margin: 10px 0;
}

.members-list-item {
    border: 0 solid rgba(0, 0, 0, 0.12);
    border-top-width: 1px;
    padding: 10px;
}
</style>

<Page>
  <Breadcrumb />
  <br />

  <div id="members-page">
    <strong>Members</strong>

    <ul id="members-list">
      {#each members as m, i}
        <li class="members-list-item">
          {m.name}
          {m.isYou ? "(you)" : ""}
          <br />
          <small>{m.isDependent ? "Dependent" : m.email}</small>
        </li>
        {#if i == members.length - 1}
          <li class="members-list-item" style="padding: 0;" />
        {/if}
      {/each}
    </ul>
    <Button prependIcon="add" on:click={() => $goto("./dependent")} outlined>Add dependent</Button>
  </div>
</Page>
