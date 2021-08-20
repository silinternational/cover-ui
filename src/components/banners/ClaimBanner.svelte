<script>
import { Banner } from '../../components'
import { getState } from '../../data/claims'

export let claimStatus = ''

$: state = claimStatus && getState(claimStatus) || {}

$: bgColor = state.bgColor || ''
$: color = state.color || ''
$: icon = state.icon || ''
$: title = state.title || ''
</script>

<style>
i.material-icons {
  margin-right: 0.5rem;
}
</style>

<Banner background="var({bgColor})"
  color="var({color})" class="{$$props.class}">
  <i class="material-icons mdc-list-item__graphic" style="color: var({color});" aria-hidden="true">{icon}</i>
  <div class="d-block">
    <div class="mdc-typography--headline6" style="color: var({color});" >{title}</div>
    <div class="multi-line-truncate fs-14" style="color: var({color});"><slot/></div>
  </div>
</Banner>
