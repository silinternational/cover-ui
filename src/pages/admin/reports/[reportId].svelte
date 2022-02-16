<script lang="ts">
import { FileLink, Modal } from 'components'
import { getLedgerReportById, LedgerReport, reconcileLedgerReport } from 'data/ledger'
import { formatDateAndTime, formatFriendlyDate } from 'helpers/dates'
import { Button, Dialog, Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let reportId = ''

onMount(async () => {
  report = await getLedgerReportById(reportId)
})

export let alertOpen = false

let report = {} as LedgerReport
let title = 'Are you sure?'
let message = 'This will permanently mark all transactions in the report as cleared!'

const buttons: Dialog.AlertButton[] = [
  { label: 'Go Back', action: 'cancel', class: 'mdc-button--raised' },
  { label: 'Proceed', action: 'proceed', class: 'mdc-dialog__button' },
]

const handleDialog = async (event: string) => {
  alertOpen = false
  if (event === 'proceed') {
    report = await reconcileLedgerReport(reportId)
  }
}
</script>

<style>
td,
th {
  padding: 0.25ex;
}

th {
  text-align: left;
}
</style>

<Page>
  <div class="flex justify-between align-items-center">
    <h4>{report.type} Report</h4>
    <Button
      on:click={() => {
        alertOpen = true
      }}>Reconcile</Button
    >

    <Dialog.Alert open={alertOpen} {buttons} defaultAction="cancel" {title} on:chosen={(e) => handleDialog(e.detail)}>
      {message}
    </Dialog.Alert>
  </div>

  <div>
    <table>
      <tr>
        <th>Report Date</th>
        <td>{formatFriendlyDate(report.date)}</td>
      </tr>
      <tr>
        <th>Created At</th>
        <td>{formatDateAndTime(report.created_at)}</td>
      </tr>
      <tr>
        <th>File</th>
        <td><FileLink file={report.file} /></td>
      </tr>
      <tr>
        <th>Cleared</th>
        <td>{report.is_cleared ? 'Yes' : 'No'}</td>
      </tr>
      <tr>
        <th>Transactions</th>
        <td>{report.transaction_count}</td>
      </tr>
    </table>
  </div>
</Page>
