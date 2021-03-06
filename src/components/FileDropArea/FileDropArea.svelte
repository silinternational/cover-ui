<script lang="ts">
import { createEventDispatcher } from 'svelte'
import { isAboveMobile } from '@silintl/ui-components'

export let raised = false
export let outlined = false
export let uploading = false
export let mimeType = 'application/pdf,image/*'

let fileInput = {} as any

let highlighted = false

const dispatch = createEventDispatcher<{ upload: FormData }>()

function highlight() {
  highlighted = true
}

function unhighlight() {
  highlighted = false
}

function handleDrop(e) {
  unhighlight()

  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}

function handleFiles(files: File[]) {
  if (!uploading) {
    uploading = true
    files = [...files] //turns files into an array so forEach works
    files.forEach(uploadFile)
  }
}

function uploadFile(file: File) {
  const formData = new FormData()

  formData.append('file', file)

  dispatch('upload', formData)
}
</script>

<style>
form > * {
  margin-top: 0;
}
#drop-area {
  border: 2px dashed #ccc;
}
#drop-area.highlighted {
  border-color: var(--mdc-theme-primary);
}

#fileElem {
  display: none;
}
.disabled {
  cursor: progress;
}
.icon {
  color: hsla(213, 6%, 55%, 1);
}
</style>

<div
  id="drop-area"
  class="br-8px {$$props.class}"
  class:highlighted
  on:dragenter|preventDefault|stopPropagation={highlight}
  on:dragleave|preventDefault|stopPropagation={unhighlight}
  on:dragover|preventDefault|stopPropagation={highlight}
  on:drop|preventDefault|stopPropagation={handleDrop}
>
  <form class="flex justify-between align-items-center my-1 px-1" class:column={!isAboveMobile()}>
    {#if !uploading}
      <input
        bind:this={fileInput}
        type="file"
        id="fileElem"
        multiple
        accept={mimeType}
        disabled={uploading}
        on:change={() => handleFiles(fileInput.files)}
      />
    {/if}
    <label
      class="mdc-button m-8px"
      for="fileElem"
      class:custom-text-button={raised}
      class:mdc-button--outlined={outlined}
      class:disabled={uploading}
      class:mdc-button--raised={raised}>Choose files</label
    >
    <div class="m-8px">or drop files here</div>
    <i class="material-icons icon m-8px" id="upload-icon">cloud_upload</i>
  </form>
</div>
