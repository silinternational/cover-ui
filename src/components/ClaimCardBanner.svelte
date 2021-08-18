<script>
export let item = {}
export let state = {}

$: bgColor = state.bgColor || ''
$: color = state.color || ''
$: icon = state.icon || ''
$: message = item.message || ''
$: title = state.title || ''
</script>

<div class="flex justify-start align-items-center black mb-2 p-1 pl-50px" style="background: var({bgColor});">
  <span class="material-icons" style="color: var({color});">{icon}</span>

  <div class="mdc-theme--primary pl-10px">
    <div class="mdc-typography--headline6 multi-line-truncate content" style="color: var({color});">{title}</div>
    <div class="multi-line-truncate fs-14" style="color: var({color});">{message}</div>
  </div>
</div>
