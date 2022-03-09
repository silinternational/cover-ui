<script lang="ts">
import { DateInput } from 'components'
import { Button, Dialog, Form, Select } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'
import { LedgerReportType } from 'data/ledger'

export let modalOpen = false

const today = new Date()
let dateString = today.toISOString().split('T')[0]

const dispatch = createEventDispatcher<{ submit: any; cancel: void }>()

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

const reportOptions = [
  {
    id: LedgerReportType.monthly,
    name: LedgerReportType.monthly,
  },
  {
    id: LedgerReportType.annual,
    name: LedgerReportType.annual,
  },
]

const formData: { date: { month: number; year: number }; type: string } = {
  date: { month: new Date(dateString).getUTCMonth(), year: new Date(dateString).getUTCFullYear() },
  type: LedgerReportType.monthly,
}
</script>

<style>
.form-button {
  float: right;
  margin: 0.5rem;
}
</style>

<Dialog.Alert
  class="mh-275px"
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
          <Select label="Input" options={reportOptions} selectedID={reportOptions[0]?.id} on:change={onSelectType} />
        </p>
        <p>
          <span class="mdc-bold-font">Date</span>
          <DateInput bind:value={dateString} />
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
