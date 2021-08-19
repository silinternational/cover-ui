<script>
import { ClaimCard } from './index'

export let claims
</script>

<style>
.card {
  margin: 8px 8px 8px 0;
  flex-basis: 330px;
}
</style>

<div class="flex justify-start flex-wrap {$$props.class}">
  {#each claims as claim (claim.id) }
    {#each (claim.items || []) as item (item.id) }
      <div class="card">
        <ClaimCard {claim} {item} on:edit-claim on:goto-claim />
      </div>
    {/each}
  {/each}
</div>
