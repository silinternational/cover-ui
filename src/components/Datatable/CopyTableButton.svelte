<script lang="ts">
import { copyToClipboard } from '../../helpers/clipboard'
import { Button, setNotice } from '@silintl/ui-components'

export let uniqueTableClass: string

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
    setNotice('There was a problem copying the table, you can highlight the table and copy it manually')
  }
  hiddenElement.remove()
}
</script>

<Button on:click={copy}>Copy Table contents</Button>
