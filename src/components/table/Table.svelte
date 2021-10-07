<script lang="ts">
export let headers: string[]
export let loading: boolean
</script>

<style>
.filtered-table {
  border: none;
}

th {
  text-align: left;
}
</style>

{#if loading}
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
