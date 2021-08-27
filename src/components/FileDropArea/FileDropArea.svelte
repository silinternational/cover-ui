<script>
import { Progress } from "@silintl/ui-components"
import { createEventDispatcher } from "svelte"

export let raised = false
export let outlined = false
export let uploading = false

let fileInput = {}

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
    let img = document.createElement('img')
    img.style = "width: -webkit-fill-available; margin-bottom: 10px ;margin-right: 10px;vertical-align: middle;"
    img.src = reader.result
    document.getElementById('gallery').appendChild(img)
  }
}

</script>
  
<style>
#drop-area {
  border: 2px dashed #ccc;
  border-radius: 20px;
  font-family: sans-serif;
}
#drop-area.highlighted {
  border-color: var(--mdc-theme-primary);
}

#fileElem {
  display: none;
}
form {
  gap: 10px;
  align-items: center;
  justify-items: center;
}
.disabled {
  cursor: progress;
}
.icon {
  color: hsla(213, 6%, 55%, 1);
}

</style>

<div id="drop-area" class="p-20px {$$props.class}" class:highlighted
  on:dragenter|preventDefault|stopPropagation={highlight}
  on:dragleave|preventDefault|stopPropagation={unhighlight}
  on:dragover|preventDefault|stopPropagation={highlight}
  on:drop|preventDefault|stopPropagation={handleDrop}>
  <form class="flex mb-10px">
    {#if ! uploading}
      <input bind:this={fileInput} type="file" id="fileElem" multiple accept="application/pdf,image/*" disabled={uploading} on:change={() => handleFiles(fileInput.files)}>
    {/if}
    <label class="mdc-button" for="fileElem" class:custom-text-button={raised} class:mdc-button--outlined={outlined} class:disabled={uploading} class:mdc-button--raised={raised}>Choose files</label>
    <div>or drop files here</div>
    <i class="material-icons icon" id="upload-icon">cloud_upload</i>
  </form>
  <div id="gallery" class="mt-10px"></div>
  {#if uploading}
    <Progress.Circular />
    <span>{`Uploading file`}</span>
  {/if}
</div>
