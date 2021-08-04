<script>
import { Breadcrumb, Description, RadioOptions, DateInput, MoneyInput } from '../../../components'
import { goto } from '@roxi/routify'
import { Button, Form, Page, TextArea, TextField } from '@silintl/ui-components'
import { fade } from 'svelte/transition'

const reasonsForLoss = [
  {
    label: 'Theft',
    value: 'theft',
  },
  {
    label: 'Dropped',
    value: 'dropped',
  },
  {
    label: 'Lightning',
    value: 'lightning',
  },
  {
    label: 'Evacuation',
    value: 'evacuation',
    description: 'For bulk claims due to large-scale events',
  }
]
const repairableOptions = [
  {
    label: 'Repairable',
    value: 'repairable',
  },
  {
    label: "Not Repairable",
    value: "not_repairable"
  }
]

let formData = {
  lostDate: new Date().toISOString().split('T')[0],
  lossReason: '',
  situationDescription: '',
  fairMarketValue: '',
  isRepairable: '',
  repairCost: '',
  receiveOption: '',
}

// TODO: make this based on a calculation
$: moneyReceiveOptions = [
  {
    label: `Repair and get reimbursed later (~$${!formData.repairCost ? 0 : formData.repairCost})`,
    value: 'repair_and_later',
  },
  {
    label: `Cash now ($${!formData.fairMarketValue ? 0 : formData.fairMarketValue})`,
    value: 'cash_now'
  }
]

const onSubmit = event => {
  // TODO: change this to POST to backend endpoint
  console.log('Form submitted:', formData)
  // TODO: make this go back a url
  $goto('/')
}
</script>

<Page>
  <Breadcrumb />
  <Form on:submit={onSubmit}>
    <p>
      <DateInput bind:value={formData.lostDate} />
      <Description>Date lost or damaged</Description>
    </p>
    <p>Reason for loss or damage</p>
    <RadioOptions name="lossReason" options={reasonsForLoss} bind:value={formData.lossReason} />
    <p>
      <TextArea label="Describe the situation" bind:value={formData.situationDescription} rows="4"></TextArea>
      <Description>What happened?</Description>
    </p>
    <p>
      <MoneyInput label="Fair market value" bind:value={formData.fairMarketValue}></MoneyInput>
      <Description>
        To convert to USD, use 
        <a href="https://www.google.com/search?q=currency+converter" target="_blank">this converter</a>.
      </Description>
    </p>
    <RadioOptions name="isRepairable" options={repairableOptions} bind:value={formData.isRepairable} />
    {#if formData.isRepairable === "repairable"}
      <p transition:fade>
        <MoneyInput label="Cost of repair" bind:value={formData.repairCost}></MoneyInput>
        <Description>
          How much will it cost to be repaired?
          <br />
          To convert to USD, use 
          <a href="https://www.google.com/search?q=currency+converter" target="_blank">this converter</a>.
        </Description>
      </p>
    {/if}
    <!--TODO: add checks to determine what text to display and which radio options to display-->
    <p>You are approved to have your item repaired. What would you like to do next? </p>
    <RadioOptions name="receiveOption" options={moneyReceiveOptions} bind:value={formData.receiveOption} />
    <p>
      <Button raised>Submit</Button>
    </p>
  </Form>
</Page>