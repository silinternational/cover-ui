<script>
import user from '../../../authn/user'
import { getItems } from '../../../data/items.js'
import { claims, initialized, createClaim } from '../../../data/claims.js'
import { Breadcrumb, Description, RadioOptions, DateInput, MoneyInput } from '../../../components'
import { goto, params } from '@roxi/routify'
import { Button, Form, Page, TextArea } from '@silintl/ui-components'
import { fade } from 'svelte/transition'

const deductible = 0.05
const regularFraction = (1 - deductible)
const evacuationFraction = 2/3
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
  },
  {
    label: 'Other',
    value: 'other'
  },
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
const breadcrumbLinks = [
  {
    name: "Items",
    url: "/items",
  },
  // TODO: make this fetch the name of the item and have that as the name 
  {
    name: "This Item",
    url: `/items/${$params.itemId}`
  },
  {
    name: "New Claim",
    url: `/items/${$params.itemId}/new-claim`
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
let items
let item
getItems(user.policy_id).then(loadedItems => {
  items = loadedItems
  item = items.find(itm => itm.id === $params.itemId)
})

// TODO: get accountable person from item 
// TODO: add reimbursed value
$: isNotRepairableOrMoneyInputsAreSet = (formData.isRepairable !== "repairable" || (formData.repairCost && formData.fairMarketValue))
$: seventyPercentCheck = (!formData.repairCost || !formData.fairMarketValue || (formData.repairCost/formData.fairMarketValue) >= .7)
$: payoutOptionCheck = formData.lossReason && isNotRepairableOrMoneyInputsAreSet && seventyPercentCheck
$: canRepair = formData.lossReason === "impact" || formData.lossReason === "lightning" || formData.lossReason === "water_damage" || formData.lossReason === "other"
$: claimExists = $claims.find(clm => clm.itemId === $params.itemId)

$: !payoutOptionCheck && unSetPayoutOption()
$: !(formData.isRepairable === "repairable" || formData.payoutOption === "cash_now") && unSetFairMarketValue()
$: formData.isRepairable !== "repairable" && unSetRepairCost()
$: !canRepair && unSetIsRepairable()
$: payoutOptionCheck && formData.payoutOption == "evacuation" && unSetPayoutOption()

$: moneyPayoutOptions = [
  {
    // TODO: make this the covered amount
    label: `Replace and get reimbursed later `,
    value: 'replace_and_reimburse',
  },
  // TODO: make this the min of either covered amount or FMV
  {
    label: `Cash now ($${(!formData.fairMarketValue ? 0 : formData.fairMarketValue)*regularFraction})`,
    value: 'cash_now'
  }
]

const onSubmit = async () => {
  let parsedFormData = formData
  if (formData.isRepairable === "repairable" && !formData.payoutOption) {
    parsedFormData.payoutOption = "repair"
  }
  // TODO: change this to POST to backend endpoint
  await createClaim(item, parsedFormData)
  // TODO: make this go back a url
  $goto('/claims')
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

<!--TODO: add transitions but not after submit-->
{#if items && $initialized && claimExists}
  Claim already exists!
{:else if items && !item}
  Item does not exist!
{:else if items && $initialized}
  <Page>
    <Breadcrumb links={breadcrumbLinks} />
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
        <div>
          <RadioOptions name="isRepairable" options={repairableOptions} bind:value={formData.isRepairable} />
        </div>
      {/if}
      {#if formData.isRepairable === "repairable"}
        <p>
          <MoneyInput label="Cost of repair" bind:value={formData.repairCost}></MoneyInput>
          <Description>
            How much will it cost to be repaired?
            <br />
            To convert to USD, use 
            <a href="https://www.google.com/search?q=currency+converter" target="_blank">this converter</a>.
          </Description>
        </p>
      {/if}
      {#if formData.isRepairable === "repairable" || formData.payoutOption === "cash_now"}
        <p>
          <MoneyInput label="Fair market value" bind:value={formData.fairMarketValue}></MoneyInput>
          <Description>
            To convert to USD, use 
            <a href="https://www.google.com/search?q=currency+converter" target="_blank">this converter</a>.
          </Description>
        </p>
      {/if}
      {#if payoutOptionCheck }
        {#if formData.lossReason !== "evacuation"}
          <div>
            <p>Payout options</p>
            <RadioOptions name="payoutOption" options={moneyPayoutOptions} bind:value={formData.payoutOption} />
          </div>
        {:else}
          <div>
            <p>We are sorry you are experiencing this situation and will keep you in our prayers.</p>
            <p>We will reach out to SIL HR to get more context about this situation.</p>
            <p>If approved, you are eligible for 2/3 payout of covered lost assets.</p>
          </div>
        {/if}
      {/if}
      {#if formData.isRepairable === "repairable" && (isNotRepairableOrMoneyInputsAreSet && !seventyPercentCheck)}
        <p>You will receive ${formData.repairCost*regularFraction} to repair your insured Item.</p>
      {/if}
      <!--TODO: add evacuation amount when items is done (covered_value*(2/3))-->
      <p>
        <Button raised>Submit</Button>
      </p>
    </Form>
  </Page>
{/if}