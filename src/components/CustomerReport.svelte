<script lang="ts">
import CreateCustomerReportModal from './CreateCustomerReportModal.svelte'
import type { Policy } from 'data/policies'
import { createPolicyLedgerReport, getLedgerReports, LedgerReport, LedgerReportType } from 'data/ledger'
import { formatDateAndTime, formatFriendlyDate } from 'helpers/dates'
import FileLink from './FileLink.svelte'
import { Button, Datatable } from '@silintl/ui-components'
import { onMount } from 'svelte'

export let policy: Policy

let ledgerReports: LedgerReport[] = []
let modalOpen = false

onMount(() => {
  loadReports()
})

async function loadReports() {
  ledgerReports = await getLedgerReports()
}

async function createReport(e: CustomEvent) {
  const reportType: LedgerReportType = e.detail.type
  const { month, year } = e.detail.date

  const report = await createPolicyLedgerReport(policy.id, reportType, month, year)
  ledgerReports = [...ledgerReports, report]
  loadReports()
  modalOpen = false
}
</script>

<div class="flex justify-between align-items-center">
  <h4>Reports</h4>
  <Button on:click={() => (modalOpen = true)}>create a report</Button>
  <CreateCustomerReportModal {modalOpen} on:submit={createReport} on:cancel={() => (modalOpen = false)} />
</div>

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
