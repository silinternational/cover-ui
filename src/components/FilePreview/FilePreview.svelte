<script lang="ts">
import Banner from '../Banner.svelte'
import { formatDate } from '../../helpers/dates'
import { Button } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let allowDelete = false
export let label = ''
export let date = ''
export let id = ''
export let purpose = ''
export let btnLabel = 'delete'

const dispatch = createEventDispatcher()

function onDelete(event: CustomEvent, id: string) {
  event.preventDefault()
  event.stopPropagation()

  dispatch('deleted', id)
}
</script>

<style>
.preview {
  background-color: hsla(213, 26%, 23%, 1);
  width: 340px;
}
.preview:hover {
  background-color: hsla(213, 26%, 23%, 0.8);
}
</style>

<div class="preview flex justify-between align-items-center br-8px p-10px mb-1 {$$props.class}" on:click on:keydown={(e) => {if (e.key === 'Enter') e.currentTarget.click()}}>
  <div>
    <p class="white my-0">{label}</p>
    <p class="white my-0">{formatDate(date)}</p>
  </div>
  {#if allowDelete}
    <Button class="delete-button" raised on:click={(evt) => onDelete(evt, id)}>{btnLabel}</Button>
  {:else if purpose}
    <Banner class="mdc-bold-font" color="hsla(213, 8%, 46%, 1)" background="hsla(213, 22%, 94%, 1)">{purpose}</Banner>
  {/if}
</div>
