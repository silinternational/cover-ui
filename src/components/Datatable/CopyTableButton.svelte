<script lang="ts">
import { Button, setNotice } from '@silintl/ui-components'

export let tableId: string

async function copy() {
  const tableContents = document.getElementsByClassName(tableId)[0]?.innerHTML
  if (tableContents) {
    try {
      const data = [
        new ClipboardItem({ 'text/html': tableContents }),
        new ClipboardItem({ 'text/plain': tableContents }),
      ]

      await navigator.clipboard.write(data)
    } catch {
      document.addEventListener('copy', handleCopy)
      document.execCommand('copy')
      document.removeEventListener('copy', handleCopy)

      function handleCopy(event: any) {
        event.clipboardData.setData('text/html', tableContents)
        event.clipboardData.setData('text/plain', tableContents)

        event.preventDefault()
      }
    } finally {
      setNotice('Copied to clipboard')
    }
  } else {
    setNotice('There was a problem copying the table, you can highlight the table and copy it manually')
  }
}
</script>

<Button on:click={copy}>Copy Table contents</Button>
