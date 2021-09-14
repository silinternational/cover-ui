<script lang="ts">
import { formatDate } from '../dates'
import { Button, Progress } from '@silintl/ui-components'
import { createEventDispatcher } from "svelte"
import { flip } from 'svelte/animate'
import { fly } from 'svelte/transition'

export let previews = []
export let uploading = false

let selectedId = ''

const dispatch = createEventDispatcher()

const isSelected = {}

$: isSelected[selectedId] = true
$: selectedId && setOthersFalse(selectedId)

const setOthersFalse = id => {
  for(const key of Object.keys(isSelected)){
    if(key != id){
      isSelected[key] = false
    }
  }
}

const onClick = id => {
  selectedId = id

  dispatch('preview', id)
}

function onDelete(event, id) {
  event.preventDefault()
  event.stopPropagation()

  dispatch('deleted', id)
}
</script>

<style>
.preview {
  background-color: hsla(213, 26%, 23%, 1);
}
.selected {
  background-color: hsla(213, 26%, 23%, .6);
}
</style>

<div class="mt-10px py-10px {$$props.class}">
  {#each previews as preview (preview.id)}
    <div on:click|preventDefault={() => onClick(preview.id)} transition:fly={{ y: 200, duration: 1500 }} animate:flip={{duration: 500}} class:selected={isSelected[preview.id]} class="preview flex justify-between align-items-center br-8px p-10px mb-1">
      <div>
        <p class="white my-0">{preview.file.name}</p>
        <p class="white my-0">{formatDate(preview.created_at)}</p>
      </div>
      <Button class="delete-button" raised on:click={evt => onDelete(evt, preview.id)}>Delete</Button>
    </div>
  {/each}
  {#if uploading}
    <Progress.Circular />
  {/if}
</div>