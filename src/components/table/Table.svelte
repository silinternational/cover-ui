<script>
import { writable } from "svelte/store";

export let headers
export let loading = new writable(false)

</script>

<style>
  .filtered-table {
    border: none;
  }

  th {
    text-align: left;
  }
</style>

{#if $loading }
  Loading...
{:else}
  <table class="filtered-table">
    <tr>
      {#each headers as h}
        <th>{h}</th>
      {/each}
    </tr>
    <slot />
  </table>
{/if}