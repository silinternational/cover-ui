<script>
import { Button } from '@silintl/ui-components'

let showLeading = false
let showTrailing = false

function toggle() {
  showTrailing = true
  showLeading = false
}
</script>

<h2>header 2</h2>

{#if !(showLeading || showTrailing)}
  <Button on:click={() => showLeading = true}>show leading icon</Button>
{/if}

{#if showLeading}
  <Button on:click={toggle} prependIcon="arrow_circle_down">show trailing</Button>
{/if}

{#if showTrailing}
  <Button on:click={() => showLeading = showTrailing = false} appendIcon="arrow_circle_up">start over</Button>
{/if}

<p class="mdc-typography--body1">Now is the time for all good...</p>

<Button disabled>disabled</Button>