<script lang="ts">
import ClaimCard from './ClaimCard.svelte'
import { type Claim, type ClaimItem, incompleteClaimItemStatuses } from '../data/claims'

export let claims: Claim[]
export let isAdmin: boolean

const isIncomplete = (claimItem: ClaimItem) => incompleteClaimItemStatuses.includes(claimItem.status)

const isRecent = (claimItem: ClaimItem) => {
  const updatedAt = new Date(claimItem.updated_at)
  const today = new Date()
  const aWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
  return Number(updatedAt) > Number(aWeekAgo)
}

const isRecentOrIncomplete = (claimItem: ClaimItem) => isIncomplete(claimItem) || isRecent(claimItem)

const getRecentOrIncompleteClaimItems = (claim: Claim): ClaimItem[] => {
  const claimItems: ClaimItem[] = claim.claim_items || []
  return claimItems.filter(isRecentOrIncomplete)
}
</script>

<style>
.card {
  margin: 8px 8px 8px 0;
  flex-basis: 330px;
}
</style>

<div class="flex justify-start flex-wrap {$$props.class}">
  {#each claims as claim (claim.id)}
    {#each getRecentOrIncompleteClaimItems(claim) as claimItem (claimItem.id)}
      <div class="card">
        <ClaimCard {claim} {claimItem} {isAdmin} on:goto-claim />
      </div>
    {/each}
  {/each}
</div>
