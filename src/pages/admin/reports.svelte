<script lang="ts">
import CreateReportModal from './_components/CreateReportModal.svelte'
import { FileLink } from 'components'
import { createLedgerReport, getLedgerReportById, getLedgerReports, LedgerReports } from 'data/ledger'
import { formatDateAndTime, formatFriendlyDate } from 'helpers/dates'
import { formatPageTitle } from 'helpers/pageTitle'
import { reportDetails } from 'helpers/routes'
import { goto, metatags } from '@roxi/routify'
import { onMount } from 'svelte'
import { Button, Datatable, Page } from '@silintl/ui-components'

let modalOpen = false

metatags.title = formatPageTitle('Admin > Reports')

onMount(getLedgerReports)

async function createReport(e: CustomEvent) {
  modalOpen = false
  await createLedgerReport(e.detail.type, e.detail.date)
  getLedgerReports()
}

function getReport(reportId: string) {
  getLedgerReportById(reportId)
}
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
      {#each $LedgerReports as report (report.id)}
        <Datatable.Data.Row on:click={() => $goto(reportDetails(report.id))} clickable>
          <Datatable.Data.Row.Item>{report.type || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{formatFriendlyDate(report.date)}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{formatDateAndTime(report.created_at)}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>
            <FileLink on:expired={() => getReport(report.id)} file={report.file} />
          </Datatable.Data.Row.Item>
        </Datatable.Data.Row>
      {/each}
    </Datatable.Data>
  </Datatable>
</Page>
