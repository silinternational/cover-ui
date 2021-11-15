<script lang="ts">
import ClaimCard from './ClaimCard.svelte'
import ItemCard from './ItemCard.svelte'
import { Claim, ClaimItem, incompleteClaimItemStatuses, isClaimItem } from 'data/claims'
import { incompleteItemCoverageStatuses, PolicyItem } from 'data/items'
import { isRecentClaim, RecentChange } from 'data/recent-activity'

type CardItem = { data: ClaimItem | PolicyItem; claim?: Claim }

export let recentChanges: RecentChange[] = []
export let claims: Claim[] = []
export let policyItems: PolicyItem[] = []
export let isAdmin: boolean = false

$: cardItems = recentChanges.length ? parseRecentChanges(recentChanges) : parseClaimsAndPolicyItems(claims, policyItems)

const isIncomplete = (card: CardItem) => {
  return isClaimItem(card.data)
    ? incompleteClaimItemStatuses.includes(card.data.status)
    : incompleteItemCoverageStatuses.includes(card.data.coverage_status)
}

const isRecent = (card: CardItem) => {
  const updatedAt = new Date(card.data.updated_at)
  const today = new Date()
  const aWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
  return Number(updatedAt) > Number(aWeekAgo)
}

const isRecentOrIncomplete = (card: CardItem) => isIncomplete(card) || isRecent(card)

const sortByUpdateDate = (cardA: CardItem, cardB: CardItem) =>
  +new Date(cardB.data.updated_at) - +new Date(cardA.data.updated_at)

const parseRecentChanges = (changes: RecentChange[]): CardItem[] => {
  let cards: CardItem[] = []
  for (let change of changes) {
    if (isRecentClaim(change)) {
      cards.push({ data: change.Claim?.claim_items[0], claim: change.Claim })
    } else if (isIncomplete({ data: change?.Item })) {
      cards.push({ data: change.Item })
    }
  }
  return cards
}

const parseClaimsAndPolicyItems = (claims: Claim[], policyItems: PolicyItem[]): CardItem[] => {
  // Add all the policy items and claim items together then filter and sort them
  let cards: CardItem[] = policyItems.map((item) => ({ data: item })) || []
  for (let claim of claims) {
    for (let claimItem of claim.claim_items) {
      cards.push({ data: claimItem, claim })
    }
  }
  return cards.filter(isRecentOrIncomplete).sort(sortByUpdateDate)
}
</script>

<style>
.card {
  margin: 8px 8px 8px 0;
  flex-basis: 330px;
}
</style>

<div class="flex justify-start flex-wrap {$$props.class}">
  {#each cardItems as cardItem (cardItem.data.id)}
    <div class="card">
      {#if isClaimItem(cardItem.data)}
        <ClaimCard claim={cardItem.claim} claimItem={cardItem.data} {isAdmin} on:goto-claim />
      {:else}
        <ItemCard item={cardItem.data} {isAdmin} on:goto-item />
      {/if}
    </div>
  {/each}
</div>
