<script lang="ts">
import { Button, setNotice } from '@silintl/ui-components'

export let tableId: string

async function copy() {
  const tableContentsClone = document.getElementsByClassName(tableId)[0].cloneNode(true)
  const hiddenElement = document.createElement('div')
  hiddenElement.appendChild(tableContentsClone)

  const elementByClassNameToRemove = [
    '.home-table-more-vert',
    '.mdc-data-table__sort-icon-button',
    '.item-menu',
    '.mdc-data-table__cell--checkbox',
  ]
  elementByClassNameToRemove.forEach((className) => {
    const elements = hiddenElement?.querySelectorAll(className)
    elements.forEach((el) => el.remove())
  })
  const html = hiddenElement.innerHTML

  if (html) {
    try {
      const data = [new ClipboardItem({ 'text/html': html }), new ClipboardItem({ 'text/plain': html })]

      await navigator.clipboard.write(data)
    } catch {
      document.addEventListener('copy', handleCopy)
      document.execCommand('copy')
      document.removeEventListener('copy', handleCopy)

      function handleCopy(event: any) {
        event.clipboardData.setData('text/html', html)
        event.clipboardData.setData('text/plain', html)

        event.preventDefault()
      }
    } finally {
      setNotice('Copied to clipboard')
    }
  } else {
    setNotice('There was a problem copying the table, you can highlight the table and copy it manually')
  }
  hiddenElement.remove()
}
</script>

<Button on:click={copy}>Copy Table contents</Button>
