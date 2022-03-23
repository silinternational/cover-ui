<script lang="ts">
import type { ReceiptType } from 'data/claims'
import type { State } from 'data/states'
import Banner from './Banner.svelte'

export let state = {} as State
export let statusReason = '' as string
export let receiptType = '' as ReceiptType
export let showRevisionMessage: boolean = false

$: bgColor = state.bgColor || ''
$: color = state.color || ''
$: icon = state.icon || ''
$: title = state.title === 'Approved' && receiptType ? `${state.title} for ${receiptType}` : state.title
</script>

<style>
.banner {
  margin-bottom: 2rem;
  padding: 1rem;
}
</style>

<Banner class={$$props.class} background="var({bgColor})" color="var({color})">
  <span class="material-icons" style="color: var({color});">{icon}</span>

  <div class="mdc-theme--primary pl-10px">
    <div class="mdc-typography--headline6 multi-line-truncate content" style="color: var({color});">
      {title}
    </div>
    {#if showRevisionMessage}
      <div class="multi-line-truncate fs-14" style="color: var({color});">{statusReason}</div>
    {/if}
  </div>
</Banner>
