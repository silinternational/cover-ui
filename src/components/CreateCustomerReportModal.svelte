<script lang="ts">
import { DateInput, Modal } from 'components'
import { Button, Form, Select } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let modalOpen = false

const today = new Date()

let end = today.toISOString().split('T')[0]
let start = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).toISOString().split('T')[0]

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

const formData: { dates: { start: string; end: string }; type: string } = {
  dates: { start, end },
  type: 'Debits',
}

const reportOptions = [
  {
    id: 'Debits',
    name: 'Debits',
  },
  {
    id: 'Credits',
    name: 'Credits',
  },
]
</script>

<style>
.form-button {
  float: right;
  margin: 0.5rem;
}
</style>

<Modal
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
          <Select label="Input" options={reportOptions} selectedID="Debits" on:change={onSelectType} />
        </p>
        {#if formData.type === 'Credits'}
          <p>
            <span class="mdc-bold-font">Report Start Date</span>
            <DateInput bind:value={formData.dates.start} />
          </p>
          <p>
            <span class="mdc-bold-font">Report End Date</span>
            <DateInput bind:value={formData.dates.end} />
          </p>
        {/if}
        <div class="form-button">
          <Button raised>Create Report</Button>
        </div>
        <div class="form-button">
          <Button on:click={onCancel}>Cancel</Button>
        </div>
      </Form>
    </div>
  {/if}
</Modal>
