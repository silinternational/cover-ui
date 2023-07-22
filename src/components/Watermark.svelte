<script lang="ts">
export let text: string = 'Watermark'
export let rowHeight: number = 200
export let colsWidth: number = 500

let innerHeight: number
let innerWidth: number
let rows: number[] = [0]
let columns: number[] = [0]

$: numberOfRows = Math.ceil(innerHeight / rowHeight) || 0
$: numberOfCols = Math.ceil(innerWidth / colsWidth) || 0
$: if (numberOfRows > 1) rows = [...Array(numberOfRows).keys()]
$: if (numberOfCols > 1) columns = [...Array(numberOfCols).keys()]

const getPixelString = (num1: number, num2: number): string => `${num1 * num2}px`
</script>

<style>
.watermark {
  font-size: 5rem;
  font-weight: 900;
  position: absolute;
  opacity: 0.1;
  z-index: 6;
  transform: rotate(-35deg);
  pointer-events: none;
}
</style>

<svelte:window bind:innerHeight bind:innerWidth />

{#each columns as column}
  {#each rows as row}
    <p
      class="watermark mdc-theme--neutral"
      style:top={getPixelString(row, rowHeight)}
      style:left={getPixelString(column, colsWidth)}
    >
      {text}
    </p>
  {/each}
{/each}
