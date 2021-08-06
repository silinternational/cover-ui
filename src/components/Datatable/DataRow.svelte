<script>
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher()

export let redirect = false

const handleOnClick = event => {
  dispatch('click', event)
}
</script>

{#if redirect}
  <style>
    tr {
      cursor: pointer;
    }
  </style>
{/if}

<tr on:click={handleOnClick} class="mdc-data-table__row">
  <slot />
</tr>