<script lang="ts">
import type { ReceiptType } from 'data/claims'
import Banner from '../Banner.svelte'

export let state: any
export let receiptType = '' as ReceiptType

$: bgColor = state.bgColor || ''
$: color = `var(${state.color})` || ''
$: icon = state.icon || ''
$: title = state.title === 'Approved' && receiptType ? `${state.title} for ${receiptType}` : state.title
</script>

<style>
i.material-icons {
  margin-right: 0.5rem;
}
</style>

<Banner background="var({bgColor})" {color} class={$$props.class}>
  <i class="material-icons" style:color aria-hidden="true">{icon}</i>
  <div class="d-block">
    <div class="mdc-typography--headline6" style:color>{title}</div>
    <div class="multi-line-truncate fs-14" style:color><slot /></div>
  </div>
</Banner>
