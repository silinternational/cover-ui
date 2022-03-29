<script lang="ts">
import CreateReportModal from './_components/CreateReportModal.svelte'
import { FileLink } from 'components'
import { createLedgerReport, getLedgerReports, LedgerReport } from 'data/ledger'
import { formatDateAndTime, formatFriendlyDate } from 'helpers/dates'
import { reportDetails } from 'helpers/routes'
import { goto } from '@roxi/routify'
import { onMount } from 'svelte'
import { Button, Datatable, Page } from '@silintl/ui-components'

let ledgerReports: LedgerReport[] = []
let modalOpen = false

onMount(loadReports)

async function loadReports() {
  ledgerReports = await getLedgerReports()
}

async function createReport(e: CustomEvent) {
  modalOpen = false
  await createLedgerReport(e.detail.type, e.detail.date)
  await loadReports()
}
// TODO: remove this filter when BE filters out policy reports
const isAdminReport = (report: LedgerReport) => !report.file?.name.includes('policy')
</script>

<Page>
  <div class="flex justify-between align-items-center">
    <h4>Reports</h4>
    <Button on:click={() => (modalOpen = true)}>Create</Button>
    <CreateReportModal {modalOpen} on:submit={createReport} on:cancel={() => (modalOpen = false)} />
  </div>

  <Datatable>
    <Datatable.Header>
      <Datatable.Header.Item>Report Type</Datatable.Header.Item>
      <Datatable.Header.Item>Report Date</Datatable.Header.Item>
      <Datatable.Header.Item>Created At</Datatable.Header.Item>
      <Datatable.Header.Item>File</Datatable.Header.Item>
    </Datatable.Header>
    <Datatable.Data>
      <!-- TODO: remove this filter when BE filters out policy reports -->
      {#each ledgerReports.filter(isAdminReport) as report (report.id)}
        <Datatable.Data.Row on:click={() => $goto(reportDetails(report.id))} clickable>
          <Datatable.Data.Row.Item>{report.type || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{formatFriendlyDate(report.date)}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{formatDateAndTime(report.created_at)}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item><FileLink file={report.file} /></Datatable.Data.Row.Item>
        </Datatable.Data.Row>
      {/each}
    </Datatable.Data>
  </Datatable>
</Page>
