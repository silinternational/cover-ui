<script lang="ts">
  import {Button, Form, Select} from '@silintl/ui-components'
  import {CreateLedgerReportInput, LedgerReportType} from 'data/ledger'
  import {createEventDispatcher} from 'svelte'
  import DateInput from '../../../components/DateInput.svelte'
  import Modal from '../../../components/mdc/Modal.svelte'

  export let modalOpen = false

  const dispatch = createEventDispatcher()

  const onSubmit = () => dispatch('submit', formData)

  const onCancel = (event: Event) => {
    event.preventDefault()
    dispatch('cancel')
    modalOpen = false
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
    }
  ]
</script>

<style>
  .float-right {
    float: right;
  }

  .form-button {
    margin: 0.5rem;
  }
</style>

<Modal
  open={modalOpen}
  buttons={[]}
  defaultAction="cancel"
  title='Create Report'
  titleIcon='summarize'
>
  {#if modalOpen}
    <div class="w-100">
      <Form on:submit={onSubmit}>
        <p>
          <span class="mdc-bold-font">Report Type</span>
          <Select label="Input" options={reportTypes} selectedID='Monthly' on:change={onSelectType} />
        </p>
        <p>
          <span class="mdc-bold-font">Report Date</span>
          <DateInput bind:value={formData.date} />
        </p>
        <div class="float-right form-button">
          <Button raised>Create Report</Button>
        </div>
        <div class="float-right form-button">
          <Button on:click={onCancel}>Cancel</Button>
        </div>
      </Form>
    </div>
  {/if}
</Modal>
