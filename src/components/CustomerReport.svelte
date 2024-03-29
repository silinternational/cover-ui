<script lang="ts">
import CreateCustomerReportModal from './CreateCustomerReportModal.svelte'
import type { Policy } from 'data/policies'
import { createPolicyLedgerReport, getLedgerReportById, LedgerReportType, policyLedgerReports } from 'data/ledger'
import { formatDateAndTime, formatFriendlyDate } from 'helpers/dates'
import { policyReportDetails } from 'helpers/routes'
import InfoModal from './InfoModal.svelte'
import FileLink from './FileLink.svelte'
import { Button, Datatable, setNotice } from '@silintl/ui-components'

export let policy: Policy

let modalOpen = false
let content =
  'You can create a report of all financial transactions for the specified month or year if any exist. The report can then be downloaded as a CSV file.'
let title = 'Creating a Report'

$: $policyLedgerReports = policy.ledger_reports || []

async function createReport(e: CustomEvent) {
  const reportType: LedgerReportType = e.detail.type
  const { month, year } = e.detail.date

  const report = await createPolicyLedgerReport(policy.id, reportType, month, year)
  if (!report.id) {
    setNotice('No transactions found for this date, please try a different month or year.')
  }
  modalOpen = false
}
const getMonth = (iso8601Date: string) => iso8601Date.split('-')[1]
const getYear = (iso8601Date: string) => iso8601Date.split('-')[0]
</script>

<div class="button-group">
  <Button outlined prependIcon="summarize" on:click={() => (modalOpen = true)}>New Report</Button>
  <InfoModal hasInfoButton {content} {title} />
</div>
<CreateCustomerReportModal {modalOpen} on:submit={createReport} on:cancel={() => (modalOpen = false)} />

<Datatable>
  <Datatable.Header>
    <Datatable.Header.Item>Report Type</Datatable.Header.Item>
    <Datatable.Header.Item>Report Date</Datatable.Header.Item>
    <Datatable.Header.Item>Created At</Datatable.Header.Item>
    <Datatable.Header.Item>File</Datatable.Header.Item>
    <Datatable.Header.Item>Printable Receipt</Datatable.Header.Item>
  </Datatable.Header>
  <Datatable.Data>
    {#each $policyLedgerReports as report (report.id)}
      <Datatable.Data.Row>
        <Datatable.Data.Row.Item>{report.type || ''}</Datatable.Data.Row.Item>
        <Datatable.Data.Row.Item>{formatFriendlyDate(report.date)}</Datatable.Data.Row.Item>
        <Datatable.Data.Row.Item>{formatDateAndTime(report.created_at)}</Datatable.Data.Row.Item>
        <Datatable.Data.Row.Item>
          <FileLink on:expired={() => getLedgerReportById(report.id, true)} file={report.file} />
        </Datatable.Data.Row.Item>
        {#if report.type === LedgerReportType.monthly}
          <Datatable.Data.Row.Item>
            <a target="_blank" href={policyReportDetails(policy.id, getMonth(report.date), getYear(report.date))}>
              open
            </a>
          </Datatable.Data.Row.Item>
        {/if}
      </Datatable.Data.Row>
    {:else}
      <Datatable.Data.Row>
        <Datatable.Data.Row.Item><i>None</i></Datatable.Data.Row.Item>
      </Datatable.Data.Row>
    {/each}
  </Datatable.Data>
</Datatable>
