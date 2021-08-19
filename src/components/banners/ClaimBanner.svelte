<script>
import { Banner } from '../../components'
import { getState } from '../../data/claims'

export let claim = {}
export let item = {}

$: state = getState(claim) || {}

$: bgColor = state.bgColor || ''
$: color = state.color || ''
$: icon = state.icon || ''
$: title = state.title || ''
$: message = item.message || ''
</script>

<style>
i.material-icons {
  margin-right: 0.5rem;
}
.width {
  width: unset;
}
</style>

<Banner background="var({bgColor})"
        color="var({color})" class="{$$props.class} width">
  <i class="material-icons mdc-list-item__graphic" style="color: var({color});" aria-hidden="true">{icon}</i>
  <div class="d-block">
    <div class="mdc-typography--headline6" style="color: var({color});" >{title}</div>
    <div class="multi-line-truncate fs-14" style="color: var({color});">{message}</div>
  </div>
</Banner>
