<script lang="ts">
import type { ReceiptType } from 'data/claims'
import type { State } from 'data/states'
import Banner from './Banner.svelte'

export let state = {} as State
export let statusReason = '' as string
export let receiptType = '' as ReceiptType
export let showRevisionMessage: boolean = false

$: background = `var(${state.bgColor})` || ''
$: color = `var(${state.color})` || ''
$: icon = state.icon || ''
$: title = state.title === 'Approved' && receiptType ? `${state.title} for ${receiptType}` : state.title
</script>

<Banner class={$$props.class} {background} {color}>
  <span class="material-icons" style:color>{icon}</span>

  <div class="mdc-theme--primary pl-10px">
    <div class="mdc-typography--headline6 multi-line-truncate content" style:color>
      {title}
    </div>
    {#if showRevisionMessage}
      <div class="multi-line-truncate fs-14" style:color>{statusReason}</div>
    {/if}
  </div>
</Banner>
