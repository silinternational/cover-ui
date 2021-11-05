<script lang="ts">
import type { AccountablePersonOptions } from 'data/accountablePersons'
import type { Claim } from 'data/claims'
import ClaimCard from './ClaimCard.svelte'

export let claims: Claim[]
export let accountablePersons = [] as AccountablePersonOptions[]
export let isAdmin: boolean
</script>

<style>
.card {
  margin: 8px 8px 8px 0;
  flex-basis: 330px;
}
</style>

<div class="flex justify-start flex-wrap {$$props.class}">
  {#each claims as claim (claim.id)}
    {#each claim.claim_items || [] as claimItem (claimItem.id)}
      <div class="card">
        <ClaimCard {claim} {claimItem} {accountablePersons} {isAdmin} on:goto-claim />
      </div>
    {/each}
  {/each}
</div>
