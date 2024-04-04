<script lang="ts">
import { copyToClipboard } from '../../helpers/clipboard'
import InfoModal from '../InfoModal.svelte'
import { Button, setNotice } from '@silintl/ui-components'

export let uniqueTableClass: string

let content =
  'You can paste the contents of this table into a spreadsheet program like Excel or Google Sheets. On Windows, type Ctrl+V. On macOS, type ⌘+V.'
let title = 'Copy Table to Clipboard'

async function copy() {
  const tableContentsClone = document.getElementsByClassName(uniqueTableClass)[0].cloneNode(true)
  const hiddenElement = document.createElement('div')
  hiddenElement.appendChild(tableContentsClone)

  const elementByClassNameToRemove = [
    '.home-table-more-vert',
    '.mdc-data-table__sort-icon-button',
    '.item-menu',
    '.mdc-data-table__cell--checkbox',
    '.mdc-data-table__header-cell--checkbox',
  ]

  elementByClassNameToRemove.forEach((className) => {
    const elements = hiddenElement.querySelectorAll(className)
    elements.forEach((el) => el.remove())
  })

  const html = hiddenElement.innerHTML

  if (html) {
    await copyToClipboard(html)
    setNotice('Copied to clipboard')
  } else {
    setNotice('There was a problem copying the table. Try highlighting the table and copy it manually')
  }
  hiddenElement.remove()
}
</script>

<div class="flex align-items-center">
  <Button outlined appendIcon="content_copy" on:click={copy}>Copy</Button>

  <InfoModal hasInfoButton {content} {title} />
</div>
