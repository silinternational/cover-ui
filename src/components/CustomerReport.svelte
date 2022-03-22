<script lang="ts">
import CreateCustomerReportModal from './CreateCustomerReportModal.svelte'
import type { Policy } from 'data/policies'
import { createPolicyLedgerReport, LedgerReportType, policyLedgerReports } from 'data/ledger'
import { formatDateAndTime, formatFriendlyDate } from 'helpers/dates'
import FileLink from './FileLink.svelte'
import { Button, Datatable, setNotice } from '@silintl/ui-components'

export let policy: Policy

let modalOpen = false

$: ledgerReports = $policyLedgerReports

async function createReport(e: CustomEvent) {
  const reportType: LedgerReportType = e.detail.type
  const { month, year } = e.detail.date

  const report = await createPolicyLedgerReport(policy.id, reportType, month, year)
  if (!report.id) {
    setNotice('No transactions found for this date, please try a different month or year.')
  }
  modalOpen = false
}
</script>

<Button class="mb-1" on:click={() => (modalOpen = true)}>create a report</Button>
<CreateCustomerReportModal {modalOpen} on:submit={createReport} on:cancel={() => (modalOpen = false)} />

{#if ledgerReports.length > 0}
  <Datatable>
    <Datatable.Header>
      <Datatable.Header.Item>Report Type</Datatable.Header.Item>
      <Datatable.Header.Item>Report Date</Datatable.Header.Item>
      <Datatable.Header.Item>Created At</Datatable.Header.Item>
      <Datatable.Header.Item>File</Datatable.Header.Item>
    </Datatable.Header>
    <Datatable.Data>
      {#each ledgerReports as report (report.id)}
        <Datatable.Data.Row>
          <Datatable.Data.Row.Item>{report.type || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{formatFriendlyDate(report.date)}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{formatDateAndTime(report.created_at)}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item><FileLink file={report.file} /></Datatable.Data.Row.Item>
        </Datatable.Data.Row>
      {/each}
    </Datatable.Data>
  </Datatable>
{/if}
