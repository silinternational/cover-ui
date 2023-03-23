<script lang="ts">
import { CreateLedgerReportInput, LedgerReportType } from 'data/ledger'
import { Button, DateInput, Dialog, Form, Select } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let modalOpen = false

const dispatch = createEventDispatcher<{ submit: CreateLedgerReportInput; cancel: void }>()

const onSubmit = () => dispatch('submit', formData)

const onCancel = (event: Event) => {
  event.preventDefault()
  dispatch('cancel')
  modalOpen = false
}

//resets modalOpen in the parent when the modal is closed without submitting
const handleDialog = () => {
  modalOpen = false
  dispatch('cancel')
}

const onSelectType = (event: any) => {
  formData.type = event.detail?.id
}

const formData: CreateLedgerReportInput = {
  date: new Date().toISOString().split('T')[0],
  type: LedgerReportType.monthly,
}

const reportTypes = [
  {
    id: LedgerReportType.monthly,
    name: LedgerReportType.monthly,
  },
  {
    id: LedgerReportType.annual,
    name: LedgerReportType.annual,
  },
]
</script>

<style>
.form-button {
  float: right;
  margin: 0.5rem;
}
</style>

<Dialog.Alert
  open={modalOpen}
  buttons={[]}
  defaultAction="cancel"
  title="Create Report"
  titleIcon="summarize"
  on:closed={handleDialog}
>
  {#if modalOpen}
    <div class="w-100">
      <Form on:submit={onSubmit}>
        <p>
          <span class="mdc-bold-font">Report Type</span>
          <Select label="Input" options={reportTypes} selectedID="Monthly" on:change={onSelectType} />
        </p>
        <p>
          <span class="mdc-bold-font">Report Date</span>
          <DateInput bind:value={formData.date} />
        </p>
        <div class="form-button">
          <Button raised>Create Report</Button>
        </div>
        <div class="form-button">
          <Button on:click={onCancel}>Cancel</Button>
        </div>
      </Form>
    </div>
  {/if}
</Dialog.Alert>
