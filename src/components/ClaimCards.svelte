<script>
import { ClaimCard } from './index'

export let exampleItems
</script>

<style>

.cards {
  margin: 8px 8px 8px 0;
  flex-basis: 330px;
}
</style>

<div class="flex justify-start flex-wrap {$$props.class}">
  {#each exampleItems as item}
    <div class="cards">
      <ClaimCard state={ getState(item) } {item} buttons={[ { label: "Edit coverage", url: "/items/edit-coverage" } ]} />
    </div>
  {/each}
</div>
