<script lang="ts">
import {
  isFairMarketValueNeeded,
  isPotentiallyRepairable,
  isRepairCostTooHigh,
  isUnrepairableOrTooExpensive,
  LOSS_REASON_EVACUATION,
  PAYOUT_OPTION_FIXED_FRACTION,
  PAYOUT_OPTION_FMV,
  PAYOUT_OPTION_REPAIR,
  PAYOUT_OPTION_REPLACE,
} from '../../business-rules/claim-payout-amount'
import {
  ConvertCurrencyLink,
  Description,
  RadioOptions,
  DateInput,
  MoneyInput,
} from '../../components'
import { claimEventTypes, loadClaimEventTypes } from '../../data/claim-event-types'
import type { Claim, ClaimItem } from '../../data/claims'
import type { PolicyItem } from '../../data/items'
import { Button, Form, TextArea } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let claim = {} as Claim
export let item = {} as PolicyItem

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
const payoutOptions = [
  {
    label: 'Replace and get reimbursed later',
    value: PAYOUT_OPTION_REPLACE,
  },
  {
    label: 'Get fair market value (no replacement)',
    value: PAYOUT_OPTION_FMV,
  },
]

// Set default form values.
let lostDate = todayDateString
let lossReason = undefined
let situationDescription = ''
let isRepairable = undefined
let payoutOption = undefined
let repairEstimateUSD = undefined
let replaceEstimateUSD = undefined
let fairMarketValueUSD = undefined

// Set default derived (or intermediate) values.
let claimItem = {} as ClaimItem
let claimItems: ClaimItem[] = []
let isEvacuation = undefined
let lossReasonOptions = []
let potentiallyRepairable = true
let repairableEventTypeNames = []
let repairableSelection = undefined
let repairCostIsTooHigh = undefined
let shouldAskIfRepairable = false
let shouldAskForFMV = false
let shouldAskReplaceOrFMV = false
let unrepairableOrTooExpensive = undefined

// Set initial form values based on the provided data.
$: setInitialValues(claim, claimItem)

// Load the necessary data.
$: $claimEventTypes.length || loadClaimEventTypes()

// Find applicable data from component props.
$: claimItems = claim.claim_items || []
$: claimItem = claimItems.find(entry => entry.item_id === item.id) || {} as ClaimItem

// Define rules for reactive variables.
$: isEvacuation = (lossReason === LOSS_REASON_EVACUATION)
$: potentiallyRepairable = isPotentiallyRepairable($claimEventTypes, lossReason)
$: isRepairable = calculateIsRepairable(potentiallyRepairable, repairableSelection)
$: repairCostIsTooHigh = isRepairCostTooHigh(repairEstimateUSD, fairMarketValueUSD)
$: unrepairableOrTooExpensive = isUnrepairableOrTooExpensive(isRepairable, repairCostIsTooHigh)
$: shouldAskReplaceOrFMV = (!isEvacuation && (unrepairableOrTooExpensive === true))
$: shouldAskIfRepairable = !!(potentiallyRepairable && lossReason)
$: shouldAskForFMV = isFairMarketValueNeeded(isRepairable, payoutOption)
$: (payoutOption !== PAYOUT_OPTION_REPLACE) && unSetReplaceEstimate()
$: !shouldAskReplaceOrFMV && unSetPayoutOption()
$: !shouldAskIfRepairable && unSetRepairableSelection()
$: !shouldAskForFMV && unSetFairMarketValue()
$: !isRepairable && unSetRepairEstimate()

// Calculate dynamic options for radio-button prompts.
$: lossReasonOptions = $claimEventTypes.map(({name}) => ({ label: name, value: name }))

// TODO: get accountable person from item
// TODO: add reimbursed value

const calculateIsRepairable = (potentiallyRepairable, repairableSelection) => {
  if (!potentiallyRepairable) {
    return false
  }
  if (!repairableSelection) {
    return undefined
  }
  return (repairableSelection === 'repairable')
}
const determinePayoutOption = (isEvacuation, repairCostIsTooHigh, selectedPayoutOption) => {
  if (isEvacuation) {
    return PAYOUT_OPTION_FIXED_FRACTION
  }
  if (repairCostIsTooHigh === false) { // ... not merely falsy, like `null` or `undefined`
    return PAYOUT_OPTION_REPAIR
  }
  return selectedPayoutOption
}
const onSubmit = async () => {
  dispatch('submit', {
    claimData: {
      lostDate,
      lossReason,
      situationDescription,
    },
    claimItemData: {
      itemId: item.id,
      isRepairable,
      payoutOption: determinePayoutOption(isEvacuation, repairCostIsTooHigh, payoutOption),
      repairEstimateUSD,
      replaceEstimateUSD,
      fairMarketValueUSD,
    },
  })
}
const setInitialValues = (claim, claimItem) => {
  if (claim.event_date) {
    lostDate = claim.event_date.split('T')[0]
  }
  lossReason = claim.event_type || lossReason
  situationDescription = claim.event_description || situationDescription
  if (claimItem.is_repairable !== undefined) {
    repairableSelection = (claimItem.is_repairable ? 'repairable' : 'not_repairable')
  }
  payoutOption = claimItem.payout_option || payoutOption
}
const unSetPayoutOption = () => {
  payoutOption = undefined
}
const unSetFairMarketValue = () => {
  fairMarketValueUSD = undefined
}
const unSetRepairableSelection = () => {
  repairableSelection = undefined
}
const unSetRepairEstimate = () => {
  repairEstimateUSD = undefined
}
const unSetReplaceEstimate = () => {
  replaceEstimateUSD = undefined
}
</script>

<div class="w-50">
  <Form on:submit={onSubmit}>
    <p>
      <span class="ml-1">Date lost or damaged</span><br />
      <DateInput class="mt-1" bind:value={lostDate} />
    </p>
    <p>
      Reason for loss or damage
      <!--TODO: make description text on next line and inline with the above, label text-->
      <RadioOptions name="lossReason" options={lossReasonOptions} bind:value={lossReason} />
    </p>
    <p>
      <span class="ml-1">What happened?</span>
      <TextArea class="mt-1" label="Describe the situation" bind:value={situationDescription} rows="4" />
    </p>
    {#if shouldAskIfRepairable }
      <div>
        <RadioOptions name="repairableSelection" options={repairableOptions} bind:value={repairableSelection} />
      </div>
    {/if}
    
    {#if isRepairable }
      <p>
        <MoneyInput label="Repair estimate (USD)" bind:value={repairEstimateUSD} />
        <Description>
          How much will it probably cost to be repaired?
          <br />
          <ConvertCurrencyLink />
        </Description>
      </p>
      <p>
        <!-- If it's repairable, position this BEFORE the "Payout options" prompt. -->
        <MoneyInput label="Fair market value (USD)" bind:value={fairMarketValueUSD} />
        <Description>
          <ConvertCurrencyLink />
        </Description>
      </p>
    {/if}
    
    {#if shouldAskReplaceOrFMV }
      <div>
        <p>Payout options</p>
        <RadioOptions name="payoutOption" options={payoutOptions} bind:value={payoutOption} />
      </div>
      {#if payoutOption === PAYOUT_OPTION_REPLACE }
        <p>
          <MoneyInput label="Replacement estimate (USD)" bind:value={replaceEstimateUSD} />
          <Description>
            How much will it probably cost to replace?
            <br />
            <ConvertCurrencyLink />
          </Description>
        </p>
      {/if}
    {/if}

    {#if (isRepairable === false) && (payoutOption === PAYOUT_OPTION_FMV) }
      <p>
        <!-- If we know it's not repairable, position this AFTER the "Payout options" prompt. -->
        <MoneyInput label="Fair market value (USD)" bind:value={fairMarketValueUSD} />
        <Description>
          <ConvertCurrencyLink />
        </Description>
      </p>
    {/if}

    {#if isEvacuation }
      <div>
        <p>We are sorry you are experiencing this situation and will keep you in our prayers.</p>
        <p>We will reach out to SIL HR to get more context about this situation.</p>
        <p>If approved, you are eligible for 2/3 payout of covered lost assets.</p>
      </div>
    {/if}
    <!--TODO: add evacuation amount when items is done (covered_value*(2/3))-->
    <p>
      <Button raised>Submit</Button>
    </p>
  </Form>
</div>
