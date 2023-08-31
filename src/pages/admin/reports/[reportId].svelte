<script lang="ts">
import { FileLink } from 'components'
import { getLedgerReportById, LedgerReport, reconcileLedgerReport } from 'data/ledger'
import { formatPageTitle } from 'helpers/pageTitle'
import { formatDateAndTime, formatFriendlyDate } from 'helpers/dates'
import { metatags } from '@roxi/routify'
import { Button, Dialog, Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let reportId: string

$: metatags.title = formatPageTitle(`Admin > Reports > ${reportId}`)

onMount(getReport)

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

async function getReport() {
  report = await getLedgerReportById(reportId)
}
</script>

<style>
header {
  margin-block-end: 2rem;
}
dd {
  margin-inline-start: clamp(0.5rem, 2vw, 2rem);
}
dl {
  grid-column: span 1;
  display: grid;
  grid-template-columns: repeat(2, max-content);
  align-content: start;
  margin: unset;
  gap: 1rem;
}
</style>

<Page>
  <header>
    <div class="flex justify-between align-items-center">
      <h1>{report.type} Report</h1>
      <Button
        on:click={() => {
          alertOpen = true
        }}>Reconcile</Button
      >
      <Dialog.Alert open={alertOpen} {buttons} defaultAction="cancel" {title} on:chosen={(e) => handleDialog(e.detail)}>
        {message}
      </Dialog.Alert>
    </div>
    <div class="fs-14">Created {formatDateAndTime(report.created_at)}</div>
  </header>

  <div>
    <dl>
      <dt>Report Date</dt>
      <dd>{formatFriendlyDate(report.date)}</dd>
      <dt>
        File
      </dt>
      <dd><FileLink on:expired={getReport} file={report.file} /></dd>
      <dt>Cleared</dt>
      <dd>{report.is_cleared ? 'Yes' : 'No'}</dd>
      <dt>Transactions</dt>
      <dd>{report.transaction_count}</dd>
    </dl>
  </div>
</Page>
