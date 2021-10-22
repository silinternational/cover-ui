<script lang="ts">
import type { State } from 'data/states'

export let state = {} as State
export let statusReason = '' as string

$: bgColor = state.bgColor || ''
$: color = state.color || ''
$: icon = state.icon || ''
$: title = state.title || ''
$: steward = statusReason ? 'From claim handler' : ('' as string) //TODO get this from the api
</script>

<style>
.banner {
  margin-bottom: 2rem;
  padding: 1rem;
}
</style>

<div
  class="flex justify-start align-items-center black pl-50px banner {$$props.class}"
  style="background: var({bgColor});"
>
  <span class="material-icons" style="color: var({color});">{icon}</span>

  <div class="mdc-theme--primary pl-10px">
    <div class="mdc-typography--headline6 multi-line-truncate content" style="color: var({color});">
      {title}
      <div>
        {steward}
      </div>
    </div>
    <div class="multi-line-truncate fs-14" style="color: var({color});">{statusReason}</div>
  </div>
</div>
