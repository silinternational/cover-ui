<script>
import { ClaimCard } from './index'
import { states } from '../data/claims'

export let items = []

const getState = item => states[item.state]

</script>

<style>

.cards {
  margin: 8px 8px 8px 0;
  flex-basis: 330px;
}
</style>

<div class="flex justify-start flex-wrap {$$props.class}">
  {#each items as item}
    <div class="cards">
      <ClaimCard state={ getState(item) } {item} buttons={[ { label: "Edit coverage", url: "/items/edit-coverage" } ]} />
    </div>
  {/each}
</div>