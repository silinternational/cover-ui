<script>
import { Breadcrumb, Description, RadioOptions, DateInput, MoneyInput } from '../../../components'
import { goto } from '@roxi/routify'
import { Button, Form, Page, TextArea } from '@silintl/ui-components'
import { fade } from 'svelte/transition'

const reasonsForLoss = [
  {
    label: 'Theft',
    value: 'theft',
  },
  {
    label: 'Impact',
    value: 'impact',
  },
  {
    label: 'Lightning',
    value: 'lightning',
  },
  {
    label: 'Water damage',
    value: 'water_damage',
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
    label: 'Not Repairable',
    value: 'not_repairable'
  }
]

let formData = {
  lostDate: new Date().toISOString().split('T')[0],
  lossReason: '',
  situationDescription: '',
  fairMarketValue: '',
  isRepairable: '',
  repairCost: '',
  payoutOption: '',
}

// TODO: add reimbursed value
$: isNotRepairableOrMoneyInputsAreSet = (formData.isRepairable !== "repairable" || (formData.repairCost && formData.fairMarketValue))
$: seventyPercentCheck = (!formData.repairCost || !formData.fairMarketValue || (formData.repairCost/formData.fairMarketValue) >= .7)
$: payoutOptionCheck = formData.lossReason && isNotRepairableOrMoneyInputsAreSet && seventyPercentCheck
$: canRepair = formData.lossReason === "impact" || formData.lossReason === "lightning" || formData.lossReason === "water_damage"

$: !payoutOptionCheck && unSetPayoutOption()
$: !(formData.isRepairable === "repairable" || formData.payoutOption === "cash_now") && unSetFairMarketValue()
$: formData.isRepairable !== "repairable" && unSetRepairCost()
$: !canRepair && unSetIsRepairable()
$: payoutOptionCheck && formData.payoutOption == "evacuation" && unSetPayoutOption()

$: moneyPayoutOptions = [
  {
    label: `Replace and get reimbursed later (max $[covered value-deductible])`,
    value: 'replace_and_reimburse',
  },
  {
    label: `Cash now ($${!formData.fairMarketValue ? 0 : formData.fairMarketValue})`,
    value: 'cash_now'
  }
]

const onSubmit = () => {
  if (formData.isRepairable === "repairable" && !formData.payoutOption) {
    formData.payoutOption = "repair"
  }
  // TODO: change this to POST to backend endpoint
  console.log('Form submitted:', formData)
  // TODO: make this go back a url
  $goto('/')
}
const unSetPayoutOption = () => {
  formData.payoutOption = null
}
const unSetFairMarketValue = () => {
  formData.fairMarketValue = null
}
const unSetIsRepairable = () => {
  formData.isRepairable = null
}
const unSetRepairCost = () => {
  formData.repairCost = null
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
    <!--TODO: make description text on next line and inline with the above, label text-->
    <!--TODO: minimize spacing-->
    <div>
      <RadioOptions name="lossReason" options={reasonsForLoss} bind:value={formData.lossReason} />
    </div>
    <p>
      <TextArea label="Describe the situation" bind:value={formData.situationDescription} rows="4"></TextArea>
      <Description>What happened?</Description>
    </p>
    {#if canRepair}
      <div transition:fade>
        <RadioOptions name="isRepairable" options={repairableOptions} bind:value={formData.isRepairable} />
      </div>
    {/if}
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
    {#if payoutOptionCheck }
      {#if formData.lossReason !== "evacuation"}
        <div transition:fade>
          <p>Payout options</p>
          <RadioOptions name="payoutOption" options={moneyPayoutOptions} bind:value={formData.payoutOption} />
        </div>
      {:else}
        <div transition:fade>
          <p>We are sorry you are experiencing this situation and will keep you in our prayers.</p>
          <p>We will reach out to SIL HR to get more context about this situation.</p>
          <p>If approved, you are eligible for 2/3 payout of covered lost assets.</p>
        </div>
      {/if}
    {/if}
    {#if formData.isRepairable === "repairable" || formData.payoutOption === "cash_now"}
      <p transition:fade>
        <MoneyInput label="Fair market value" bind:value={formData.fairMarketValue}></MoneyInput>
        <Description>
          To convert to USD, use 
          <a href="https://www.google.com/search?q=currency+converter" target="_blank">this converter</a>.
        </Description>
      </p>
    {/if}
    <p>
      <Button raised>Submit</Button>
    </p>
  </Form>
</Page>