<script>
import { Button, Progress } from '@silintl/ui-components'
import { createEventDispatcher } from "svelte"
import { flip } from 'svelte/animate'
import { fly } from 'svelte/transition'

export let previews = []
export let uploading = false

const dispatch = createEventDispatcher()

function onDelete(event, id) {
  event.preventDefault()

  dispatch('deleted', id)
}
</script>

<style>
.preview {
  background-color: hsla(213, 26%, 23%, 1);
}
</style>

<div class="mt-10px py-10px">
  {#each previews as preview (preview.id)}
    <div transition:fly={{ y: 200, duration: 1500 }} animate:flip={{duration: 500}} class="preview flex justify-between align-items-center br-8px p-10px mb-1">
      <!-- <img class="br-8px mr-10px" src={preview.src} alt={'receipt'} /> -->
      <div>
        <p class="white my-0">{preview.file.name}</p>
        <p class="white my-0">{preview.created_at}</p>
      </div>
      <Button class="delete-button" raised on:click={evt => onDelete(evt, preview.id)}>Delete</Button>
    </div>
  {/each}
  {#if uploading}
    <Progress.Circular />
  {/if}
</div>