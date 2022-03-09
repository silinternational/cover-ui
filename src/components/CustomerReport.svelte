<script lang="ts">
import CreateCustomerReportModal from './CreateCustomerReportModal.svelte'
import type { Policy } from 'data/policies'
import { Button } from '@silintl/ui-components'
import { createPolicyLedgerReport, LedgerReportType } from 'data/ledger'

export let policy: Policy

let modalOpen = false

async function createReport(e: CustomEvent) {
  const reportType: LedgerReportType = e.detail.type
  const reportMonth: number = e.detail.date.month
  const reportYear: number = e.detail.date.year

  await createPolicyLedgerReport(policy.id, reportType, reportMonth, reportYear)
  modalOpen = false
}
</script>

<Button on:click={() => (modalOpen = true)}>download a report</Button>
<CreateCustomerReportModal {modalOpen} on:submit={createReport} on:cancel={() => (modalOpen = false)} />
