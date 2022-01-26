<script lang="ts">
  import LedgerList from './_components/LedgerList.svelte'
  import { LedgerEntry, LedgerReport, getPolicyRenewals, processPolicyRenewals } from 'data/ledger'
  import { Button, Page } from '@silintl/ui-components'
  import { onMount } from 'svelte'

  let ledgerReport: LedgerReport
  let ledgerEntries: LedgerEntry[]
  $: ledgerEntries = ledgerReport?.ledger_entries || []
  $: reportFile = ledgerReport?.file

  onMount(() => loadRenewals())

  async function loadRenewals() {
    ledgerReport = await getPolicyRenewals()
  }

  async function onUpdate() {
    await processPolicyRenewals()
    await loadRenewals()
  }

  async function onDownload() {
    // Download and rename the file. The download attribute would be overridden if added directly to Download button.
    const response = await fetch(reportFile.url)
    if (response.status != 200) {
      console.log('non-200 response from file fetch: ' + response.status)
      return
    }
    const data = await response.blob()
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = reportFile.name
    a.click()
    URL.revokeObjectURL(url)
  }
</script>

<style>

</style>

<Page>
  <div class="flex justify-between align-items-center">
    <Button raised on:click={() => onUpdate()}>Update</Button>
    <Button disabled={!reportFile?.url} on:click={() => onDownload()}>Download</Button>
  </div>

  <LedgerList header={`Coverage renewals (${ledgerEntries.length})`} {ledgerEntries} />
</Page>
