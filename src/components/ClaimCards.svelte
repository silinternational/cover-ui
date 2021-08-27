<script>
import { ClaimCard } from './index'

export let claims
export let items
</script>

<style>
.card {
  margin: 8px 8px 8px 0;
  flex-basis: 330px;
}
</style>

<div class="flex justify-start flex-wrap {$$props.class}">
  {#each claims as claim (claim.id) }
    {#each (claim.claim_items || []) as claimItem (claimItem.id) }
      <div class="card">
        <ClaimCard {claim} {claimItem} item={items.find(item => item.id === claimItem.item_id)}
                   on:edit-claim on:goto-claim />
      </div>
    {/each}
  {/each}
</div>
