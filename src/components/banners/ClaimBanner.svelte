<script lang="ts">
import { Banner } from '../../components'
import { getState, State } from '../../data/states'

export let claimStatus = ''
export let isClaim: boolean = false

$: state = (claimStatus && getState(claimStatus)) || ({} as State)

$: bgColor = state.bgColor || ''
$: color = state.color || ''
$: icon = state.icon || ''
$: title = isClaim ? state.title.claim : state.title.item || ''
</script>

<style>
i.material-icons {
  margin-right: 0.5rem;
}
</style>

<Banner background="var({bgColor})" color="var({color})" class={$$props.class}>
  <i class="material-icons mdc-list-item__graphic" style="color: var({color});" aria-hidden="true">{icon}</i>
  <div class="d-block">
    <div class="mdc-typography--headline6" style="color: var({color});">{title}</div>
    <div class="multi-line-truncate fs-14" style="color: var({color});"><slot /></div>
  </div>
</Banner>
