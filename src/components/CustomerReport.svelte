<script lang="ts">
import CreateCustomerReportModal from './CreateCustomerReportModal.svelte'
import type { Policy } from 'data/policies'
import { Button } from '@silintl/ui-components'
import { createPolicyLedgerReport, LedgerReportType } from 'data/ledger'

export let policy: Policy

let modalOpen = false

async function createReport(e: CustomEvent) {
  const reportType: LedgerReportType = e.detail.type
  const { month, year } = e.detail.date

  await createPolicyLedgerReport(policy.id, reportType, month, year)
  modalOpen = false
}
</script>

<Button on:click={() => (modalOpen = true)}>download a report</Button>
<CreateCustomerReportModal {modalOpen} on:submit={createReport} on:cancel={() => (modalOpen = false)} />
