<script>
import ClaimCardBanner from './ClaimCardBanner.svelte'
import { day } from './const'
import { goto } from '@roxi/routify'
import { Card, Button } from '@silintl/ui-components'
import { isLoadingById } from './progress'

export let claim = {}
export let item = {}
export let state = {}
export let buttons = []

const now = Date.now()

$: msAgo = now - Date.parse(item.updated_at)
$: daysAgo = msAgo > 0 ? Math.floor(msAgo/day) : '-'

const gotoItem = () => item.id && $goto(`/requests/${item.id}`)
const checkIfLoading = (id, string = '') => isLoadingById(id) ? 'loading...' : string
</script>

<style>
.action {
    margin: 16px;
}

.content {
  overflow-wrap: anywhere;
  padding-bottom: .5rem;
}

.multi-line-truncate {
  /* See https://stackoverflow.com/a/13924997 and https://caniuse.com/#search=line-clamp for details. */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* number of lines to show */
}

.ml-50px {
  margin-left: 50px;
}
</style>

<Card isClickable noPadding on:click={gotoItem} on:keypress={gotoItem} class="height-fit-content py-0 {$$props.class}">
  <ClaimCardBanner {state} {item} />

  <div class="mdc-typography--headline5 multi-line-truncate content ml-50px">
    {item.name || checkIfLoading(item.id)}
  </div>

  <div class="content multi-line-truncate ml-50px">
    {item.accountable_person || checkIfLoading(item.id)}
  </div>

  <div class="action pb-2 ml-50px" slot="actions">
    {#if buttons}
      {#each buttons as btn}
        <Button raised url={btn.url}>{btn.label}</Button>
      {/each}
    {/if}

    <div class="fs-12 gray mt-1">
      {#if daysAgo}
        Last changed {daysAgo} days ago
      {:else}
        <div>{checkIfLoading(item.id, 'No changes')}</div>
      {/if}
    </div>
  </div>
</Card>
