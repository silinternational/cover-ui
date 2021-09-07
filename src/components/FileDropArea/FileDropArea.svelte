<script>
import { Button, Progress } from "@silintl/ui-components"
import { createEventDispatcher } from "svelte"

export let raised = false
export let outlined = false
export let uploading = false
export let showPreview = true

let fileInput = {}
let previews = []

let highlighted = false

const dispatch = createEventDispatcher()

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

function handleFiles(files) {
  if(! uploading) {
    uploading = true
    files = [...files]
    files.forEach(uploadFile)
    files.forEach(previewFile)
  }
}

function uploadFile(file) {
  const formData = new FormData()

  formData.append('file', file)

  dispatch('upload', formData)
}

function previewFile(file) {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    const preview = {
      src: reader.result,
      name: file.name
    }
    previews = [...previews, preview]
  }
}

function onDelete(event, name) {
  event.preventDefault()

  previews = previews.filter(preview => preview.name != name)

  dispatch('deleted', name)
}

</script>
  
<style>
form > * {
  margin-top: 0;
}
#drop-area {
  border: 2px dashed #ccc;
  font-family: Source Sans Pro, Roboto, sans-serif;
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
.preview {
  background-color: hsla(213, 26%, 23%, 1);
}
.preview img {
  max-width: 50px;
  vertical-align: middle;
}
</style>

<div class="{$$props.class}">
  <div id="drop-area" class="br-8px" class:highlighted
    on:dragenter|preventDefault|stopPropagation={highlight}
    on:dragleave|preventDefault|stopPropagation={unhighlight}
    on:dragover|preventDefault|stopPropagation={highlight}
    on:drop|preventDefault|stopPropagation={handleDrop}>
    <form class="flex justify-between align-items-center my-1 px-1">
      {#if ! uploading}
        <input bind:this={fileInput} type="file" id="fileElem" multiple accept="application/pdf,image/*" disabled={uploading} on:change={() => handleFiles(fileInput.files)}>
      {/if}
      <label class="mdc-button mt-1" for="fileElem" class:custom-text-button={raised} class:mdc-button--outlined={outlined} class:disabled={uploading} class:mdc-button--raised={raised}>Choose files</label>
      <div>or drop files here</div>
      <i class="material-icons icon" id="upload-icon">cloud_upload</i>
    </form>
  </div>

  {#if showPreview}
    <div class="mt-10px py-10px">
      {#each previews as preview}
        {#if uploading}
          <Progress.Circular />
        {/if}
        
        <div class="preview flex justify-between align-items-center br-8px p-10px mb-1">
          <img class="mr-10px" src={preview.src} alt={'receipt'} />
          <p class="white">{preview.name}</p>
          <Button class="delete-button" raised on:click={evt => onDelete(evt, preview.name)}>Delete</Button>
        </div>
      {/each}
    </div>
  {/if}
</div>
