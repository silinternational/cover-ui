<script lang="ts">
import type { ClaimFile } from 'data/claims'
import FilePreview from './FilePreview.svelte'
import { Progress } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'
import { flip } from 'svelte/animate'

export let allowDelete = false
export let previews = [] as ClaimFile[]
export let uploading: boolean = false

let selectedId: string = ''

const isSelected = {} as any

$: isSelected[selectedId] = true
$: selectedId && setOthersFalse(selectedId)

const dispatch = createEventDispatcher()

const onClick = (e: Event, id: string) => {
  e.preventDefault()
  selectedId = id

  dispatch('preview', id)
}

const setOthersFalse = (id: string) => {
  for (const key of Object.keys(isSelected)) {
    if (key != id) {
      isSelected[key] = false
    }
  }
}
</script>

<style>
.selected {
  background-color: hsla(213, 26%, 23%, 0.6);
}
</style>

<div class="mt-10px py-10px {$$props.class}">
  {#each previews as preview (preview.id)}
    <div animate:flip={{ duration: 500 }}>
      <FilePreview
        {allowDelete}
        date={preview.created_at}
        label={preview.file.name}
        id={preview.id}
        purpose={preview.purpose}
        class={isSelected[preview.id] ? 'selected w-100' : 'w-100'}
        on:click={(e) => onClick(e, preview.id)}
        on:deleted
        on:preview
      />
    </div>
  {/each}
  {#if uploading}
    <Progress.Circular />
  {/if}
</div>
