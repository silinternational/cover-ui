<script lang="ts">
import Banner from '../components/Banner.svelte'
import type { ClaimFile } from 'data/claims'
import { formatDate } from '../dates'
import { createEventDispatcher } from 'svelte'
import { flip } from 'svelte/animate'
import { Button, Progress } from '@silintl/ui-components'

export let previews = [] as ClaimFile[]
export let uploading: boolean = false
export let isMemberOfPolicy: boolean = false

let selectedId: string = ''

const dispatch = createEventDispatcher()

const isSelected = {} as any

$: isSelected[selectedId] = true
$: selectedId && setOthersFalse(selectedId)

const setOthersFalse = (id: string) => {
  for (const key of Object.keys(isSelected)) {
    if (key != id) {
      isSelected[key] = false
    }
  }
}

const onClick = (id: string) => {
  selectedId = id

  dispatch('preview', id)
}

//Todo bring back delete for 1.1
// function onDelete(event: CustomEvent, id: string) {
//   event.preventDefault()
//   event.stopPropagation()

//   dispatch('deleted', id)
// }
</script>

<style>
.preview {
  background-color: hsla(213, 26%, 23%, 1);
}
.preview:hover {
  background-color: hsla(213, 26%, 23%, 0.8);
}
.selected {
  background-color: hsla(213, 26%, 23%, 0.6);
}
</style>

<div class="mt-10px py-10px {$$props.class}">
  {#each previews as preview (preview.id)}
    <div
      on:click|preventDefault={() => onClick(preview.id)}
      animate:flip={{ duration: 500 }}
      class:selected={isSelected[preview.id]}
      class="preview flex justify-between align-items-center br-8px p-10px mb-1"
    >
      <div>
        <p class="white my-0">{preview.file.name}</p>
        <p class="white my-0">{formatDate(preview.created_at)}</p>
      </div>
      {#if preview.purpose}
        <Banner class="mdc-bold-font" color="hsla(213, 8%, 46%, 1)" background="hsla(213, 22%, 94%, 1)"
          >{preview.purpose}</Banner
        >
      {/if}
    </div>
  {/each}
  {#if uploading}
    <Progress.Circular />
  {/if}
</div>
