<script>
import {
  ConvertCurrencyLink,
  Description,
  RadioOptions,
  DateInput,
  MoneyInput,
} from '../../components'
import { claimEventTypes, loadClaimEventTypes } from '../../data/claim-event-types'
import { formatMoney } from '../../helpers/money'
import { Button, Form, TextArea } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let claim = {}
export let item = {}

const dispatch = createEventDispatcher()

const todayDateString = new Date().toISOString().split('T')[0]
const deductible = 0.05
const regularFraction = (1 - deductible)
const evacuationFraction = 2/3
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

$: claimItems = claim.claim_items || []
$: claimItem = claimItems.find(entry => entry.item_id === item.id) || {}

$: $claimEventTypes.length || loadClaimEventTypes()
$: lossReasonOptions = $claimEventTypes.map(({name}) => ({ label: name, value: name }))
$: repairableEventTypeNames = $claimEventTypes.filter(entry => entry.is_repairable).map(entry => entry.name)

// Set default values.
let lostDate = todayDateString
let lossReason = ''
let situationDescription = ''
let repairableSelection = null
let fairMarketValueUSD = ''
let repairCostUSD = ''
let payoutOption = ''

// Set initial values based on the provided claim and claim-item data.
$: setInitialValues(claim, claimItem)

// TODO: get accountable person from item 
// TODO: add reimbursed value
$: isNotRepairableOrMoneyInputsAreSet = (repairableSelection !== "repairable" || (repairCostUSD && fairMarketValueUSD))
$: seventyPercentCheck = (!repairCostUSD || !fairMarketValueUSD || (repairCostUSD/fairMarketValueUSD) >= .7)
$: payoutOptionCheck = lossReason && isNotRepairableOrMoneyInputsAreSet && seventyPercentCheck
$: isPotentiallyRepairable = repairableEventTypeNames.includes(lossReason)

$: !payoutOptionCheck && unSetPayoutOption()
$: !(repairableSelection === "repairable" || payoutOption === "cash_now") && unSetFairMarketValue()
$: repairableSelection !== "repairable" && unSetRepairCost()
$: !isPotentiallyRepairable && unSetRepairableSelection()
$: payoutOptionCheck && payoutOption == "evacuation" && unSetPayoutOption()

$: moneyPayoutOptions = [
  {
    // TODO: make this the covered amount
    label: `Replace and get reimbursed later`,
    value: 'replace_and_reimburse',
  },
  // TODO: make this the min of either covered amount or FMV
  {
    label: `Cash now (${formatMoney((fairMarketValueUSD || 0) * 100 * regularFraction)})`,
    value: 'cash_now'
  }
]

const onSubmit = async () => {
  if (repairableSelection === "repairable" && !payoutOption) {
    payoutOption = "repair"
  }
  dispatch('submit', {
    claimData: {
      lostDate,
      lossReason,
      situationDescription,
    },
    claimItemData: {
      fairMarketValueUSD,
      repairableSelection,
      itemId: item.id,
      repairCostUSD,
      payoutOption,
    },
  })
}
const setInitialValues = (claim, claimItem) => {
  if (claim.event_date) {
    lostDate = claim.event_date.split('T')[0]
  }
  lossReason = claim.event_type || lossReason
  situationDescription = claim.event_description || situationDescription
  if (isPotentiallyRepairable) {
    repairableSelection = (claimItem.is_repairable ? 'repairable' : 'not_repairable')
  }
  payoutOption = claimItem.payout_option || payoutOption
}
const unSetPayoutOption = () => {
  payoutOption = null
}
const unSetFairMarketValue = () => {
  fairMarketValueUSD = null
}
const unSetRepairableSelection = () => {
  repairableSelection = null
}
const unSetRepairCost = () => {
  repairCostUSD = null
}
</script>

<div class="w-50">
  <Form on:submit={onSubmit}>
    <p>
      <DateInput bind:value={lostDate} />
      <Description>Date lost or damaged</Description>
    </p>
    <p>Reason for loss or damage</p>
    <!--TODO: make description text on next line and inline with the above, label text-->
    <!--TODO: minimize spacing-->
    <div>
      <RadioOptions name="lossReason" options={lossReasonOptions} bind:value={lossReason} />
    </div>
    <p>
      <TextArea label="Describe the situation" bind:value={situationDescription} rows="4" />
      <Description>What happened?</Description>
    </p>
    {#if isPotentiallyRepairable}
      <div>
        <RadioOptions name="repairableSelection" options={repairableOptions} bind:value={repairableSelection} />
      </div>
    {/if}
    {#if repairableSelection === "repairable"}
      <p>
        <MoneyInput label="Cost of repair" bind:value={repairCostUSD} />
        <Description>
          How much will it cost to be repaired?
          <br />
          <ConvertCurrencyLink />
        </Description>
      </p>
    {/if}
    {#if repairableSelection === "repairable" || payoutOption === "cash_now"}
      <p>
        <MoneyInput label="Fair market value" bind:value={fairMarketValueUSD} />
        <Description>
          <ConvertCurrencyLink />
        </Description>
      </p>
    {/if}
    {#if payoutOptionCheck }
      {#if lossReason !== "Evacuation"}
        <div>
          <p>Payout options</p>
          <RadioOptions name="payoutOption" options={moneyPayoutOptions} bind:value={payoutOption} />
        </div>
      {:else}
        <div>
          <p>We are sorry you are experiencing this situation and will keep you in our prayers.</p>
          <p>We will reach out to SIL HR to get more context about this situation.</p>
          <p>If approved, you are eligible for 2/3 payout of covered lost assets.</p>
        </div>
      {/if}
    {/if}
    {#if repairableSelection === "repairable" && (isNotRepairableOrMoneyInputsAreSet && !seventyPercentCheck)}
      <p>You will receive {formatMoney(repairCostUSD * 100 * regularFraction)} to repair your insured Item.</p>
    {/if}
    <!--TODO: add evacuation amount when items is done (covered_value*(2/3))-->
    <p>
      <Button raised>Submit</Button>
    </p>
  </Form>
</div>
