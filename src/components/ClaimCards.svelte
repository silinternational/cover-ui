<script lang="ts">
import type { Claim } from '../data/claims';
import type { PolicyItem } from '../data/items';

import { ClaimCard } from './index'
import { goto } from '@roxi/routify'

export let claims: Claim[]
export let items: PolicyItem[]

const onGotoClaim = event => $goto(`/claims/${event.detail}`)
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
        <ClaimCard {claim} {claimItem} item={items.find(item => item.id === claimItem.item_id) || {}}
                  on:goto-claim={onGotoClaim} />
      </div>
    {/each}
  {/each}
</div>
