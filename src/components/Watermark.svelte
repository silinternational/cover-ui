<script lang="ts">
export let text: string = 'Watermark'
export let rowHeight: number = 250
export let colsWidth: number = 400

let innerHeight: number
let innerWidth: number
let rows: number[] = [0]
let columns: number[] = [0]

$: numberOfRows = Math.ceil(innerHeight / rowHeight) || 0
$: numberOfCols = Math.ceil(innerWidth / colsWidth) || 0
$: if (numberOfRows > 1) rows = [...Array(numberOfRows).keys()]
$: if (numberOfCols > 1) columns = [...Array(numberOfCols).keys()]
</script>

<style>
.watermark {
  position: absolute;
  opacity: 0.3;
  z-index: 6;
  transform: rotate(-35deg);
}
</style>

<svelte:window bind:innerHeight bind:innerWidth />

{#each columns as column}
  {#each rows as row}
    <h3 class="watermark mdc-theme--neutral" style="top: {row * rowHeight}px; left: {column * colsWidth}px;">
      {text}
    </h3>
  {/each}
{/each}
