<script lang="ts">
import {
  isFairMarketValueNeeded,
  isPotentiallyRepairable,
  isRepairCostTooHigh,
  isUnrepairableOrTooExpensive,
  LOSS_REASON_EVACUATION,
} from '../../business-rules/claim-payout-amount'
import { claimIncidentTypes, loadClaimIncidentTypes } from 'data/claim-incident-types'
import { Claim, ClaimItem, PayoutOption } from 'data/claims'
import type { PolicyItem } from 'data/items'
import DateInput from 'DateInput.svelte'
import Description from 'Description.svelte'
import ConvertCurrencyLink from 'ConvertCurrencyLink.svelte'
import MoneyInput from 'MoneyInput.svelte'
import RadioOptions from 'RadioOptions.svelte'
import { assertHas } from '../../validation/assertions'
import { Button, Form, TextArea } from '@silintl/ui-components'
import { createEventDispatcher, onMount } from 'svelte'

export let claim = {} as Claim
export let item = {} as PolicyItem

const dispatch = createEventDispatcher()

const todayDateString = new Date().toISOString().split('T')[0]
const repairableOptions = [
  {
    label: 'Repairable',
    value: 'repairable',
  },
  {
    label: 'Not Repairable',
    value: 'not_repairable',
  },
]
const payoutOptions = [
  {
    label: 'Replace and get reimbursed later',
    value: PayoutOption.Replacement,
  },
  {
    label: 'Get fair market value (no replacement)',
    value: PayoutOption.FMV,
  },
]

// Set default form values.
let lostDate = todayDateString
let lossReason: string
let situationDescription = ''
let isRepairable: boolean | undefined
let payoutOption: PayoutOption | undefined

// Set default derived (or intermediate) values.
let claimItem = {} as ClaimItem
let claimItems: ClaimItem[] = []
let isEvacuation: boolean
let lossReasonOptions: { label: string; value: string }[] = []
let potentiallyRepairable = true
let repairableSelection: string | undefined
let repairCostIsTooHigh: boolean | undefined
let shouldAskIfRepairable = false
let shouldAskForFMV = false
let shouldAskReplaceOrFMV = false
let unrepairableOrTooExpensive: boolean | undefined
let repairEstimateUSD: number | undefined
let replaceEstimateUSD: number | undefined
let fairMarketValueUSD: number | undefined

// Load the necessary data.
onMount(() => $claimIncidentTypes.length || loadClaimIncidentTypes())

// Set initial form values based on the provided data.
$: setInitialValues(claim, claimItem)

// Find applicable data from component props.
$: claimItems = claim.claim_items || []
$: claimItem = claimItems.find((entry) => entry.item_id === item.id) || ({} as ClaimItem)

// Define rules for reactive variables.
$: isEvacuation = lossReason === LOSS_REASON_EVACUATION
$: potentiallyRepairable = isPotentiallyRepairable($claimIncidentTypes, lossReason)
$: isRepairable = calculateIsRepairable(potentiallyRepairable, repairableSelection)
$: repairCostIsTooHigh = isRepairCostTooHigh(repairEstimateUSD, fairMarketValueUSD)
$: unrepairableOrTooExpensive = isUnrepairableOrTooExpensive(isRepairable, repairCostIsTooHigh)
$: shouldAskReplaceOrFMV = !isEvacuation && unrepairableOrTooExpensive === true
$: shouldAskIfRepairable = !!(potentiallyRepairable && lossReason)
$: shouldAskForFMV = isFairMarketValueNeeded(isRepairable, payoutOption)
$: payoutOption !== PayoutOption.Replacement && unSetReplaceEstimate()
$: !shouldAskReplaceOrFMV && unSetPayoutOption()
$: !shouldAskIfRepairable && unSetRepairableSelection()
$: !shouldAskForFMV && unSetFairMarketValue()
$: !isRepairable && unSetRepairEstimate()
$: needsEvidence = !unrepairableOrTooExpensive || payoutOption === PayoutOption.FMV
$: needsPayoutOption = !(isRepairable || isEvacuation) || repairCostIsTooHigh
$: canContinueToEvidence = (!!repairEstimateUSD && !!fairMarketValueUSD) || (!!fairMarketValueUSD && !isRepairable)
$: saveButtonIsDisabled = !situationDescription || !lossReason
$: submitIsDisabled =
  saveButtonIsDisabled ||
  (potentiallyRepairable && !repairableSelection) ||
  (isRepairable && (!repairEstimateUSD || !fairMarketValueUSD)) ||
  (needsPayoutOption && !payoutOption) ||
  (payoutOption === PayoutOption.Replacement && !replaceEstimateUSD)

// Calculate dynamic options for radio-button prompts.
$: lossReasonOptions = $claimIncidentTypes.map(({ name, description }) => ({ label: name, value: name, description }))

// TODO: get accountable person from item
// TODO: add reimbursed value

const calculateIsRepairable = (potentiallyRepairable: boolean, repairableSelection?: string) => {
  if (!potentiallyRepairable) {
    return false
  }
  if (!repairableSelection) {
    return undefined
  }
  return repairableSelection === 'repairable'
}

const determinePayoutOption = (
  isEvacuation: boolean,
  repairCostIsTooHigh?: boolean,
  selectedPayoutOption?: PayoutOption
) => {
  if (isEvacuation) {
    return PayoutOption.FixedFraction
  }
  if (repairCostIsTooHigh === false) {
    // ... not merely falsy, like `null` or `undefined`
    return PayoutOption.Repair
  }
  return selectedPayoutOption
}
const validateForm = () => {
  assertHas(lossReason, 'Please select a reason for loss or damage')
  assertHas(situationDescription, 'Please describe the situation')
  potentiallyRepairable && assertHas(repairableSelection, 'Please specify if the item is repairable')
  if (isRepairable) {
    assertHas(repairEstimateUSD, 'Please enter a repair estimate')
    assertHas(fairMarketValueUSD, 'Please enter a fair market value')
  }
  needsPayoutOption && assertHas(payoutOption, 'Please select a payout option')
}

const onSubmitClaim = (event: Event) => {
  event.preventDefault()
  validateForm()
  if (payoutOption === PayoutOption.Replacement) assertHas(replaceEstimateUSD, 'Please enter a replacement estimate')
  dispatch('submit', getFormData())
}

const onSaveForLater = (event: Event) => {
  event.preventDefault()
  dispatch('save-for-later', getFormData())
}

const getFormData = () => {
  return {
    claimData: {
      lostDate,
      lossReason,
      situationDescription,
    },
    claimItemData: {
      itemId: item.id,
      isRepairable: isRepairable ?? null,
      payoutOption: determinePayoutOption(isEvacuation, repairCostIsTooHigh, payoutOption),
      repairEstimateUSD,
      replaceEstimateUSD,
      fairMarketValueUSD,
    },
  }
}

const setInitialValues = (claim: Claim, claimItem: ClaimItem) => {
  if (claim.incident_date) {
    lostDate = claim.incident_date.split('T')[0]
  }
  lossReason = claim.incident_type || lossReason
  situationDescription = claim.incident_description || situationDescription
  if ((claimItem.is_repairable as any) instanceof Boolean) {
    repairableSelection = claimItem.is_repairable ? 'repairable' : 'not_repairable'
  }

  payoutOption = claimItem.payout_option || payoutOption

  repairEstimateUSD = claimItem.repair_estimate / 100
  replaceEstimateUSD = claimItem.replace_estimate / 100
  fairMarketValueUSD = claimItem.fmv / 100
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
  <Form>
    <p>
      <span class="header">Date lost or damaged</span>
      <DateInput bind:value={lostDate} />
    </p>
    <p>
      <span class="header">Reason for loss or damage</span>
      <!--TODO: make description text on next line and inline with the above, label text-->
      <RadioOptions name="lossReason" options={lossReasonOptions} bind:value={lossReason} />
    </p>
    <p>
      <span class="header">What happened?</span>
      <TextArea label="Describe the situation" bind:value={situationDescription} rows="4" />
    </p>
    {#if shouldAskIfRepairable}
      <div>
        <RadioOptions name="repairableSelection" options={repairableOptions} bind:value={repairableSelection} />
      </div>
    {/if}

    {#if isRepairable}
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

    {#if shouldAskReplaceOrFMV}
      <div>
        <span class="header">Payout options</span>
        <RadioOptions name="payoutOption" options={payoutOptions} bind:value={payoutOption} />
      </div>
      {#if payoutOption === PayoutOption.Replacement}
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

    {#if isRepairable === false && payoutOption === PayoutOption.FMV}
      <p>
        <!-- If we know it's not repairable, position this AFTER the "Payout options" prompt. -->
        <MoneyInput label="Fair market value (USD)" bind:value={fairMarketValueUSD} />
        <Description>
          <ConvertCurrencyLink />
        </Description>
      </p>
    {/if}

    {#if isEvacuation}
      <div>
        <p>We are sorry you are experiencing this situation and will keep you in our prayers.</p>
        <p>We will reach out to SIL HR to get more context about this situation.</p>
        <p>If approved, you are eligible for 2/3 payout of covered lost assets.</p>
      </div>
    {/if}
    <!--TODO: add evacuation amount when items is done (covered_value*(2/3))-->
    <p>
      <Button on:click={onSaveForLater} disabled={saveButtonIsDisabled} outlined>Save For Later</Button>
      {#if needsEvidence}
        <Button on:click={onSaveForLater} disabled={!canContinueToEvidence} raised>Continue</Button>
      {:else}
        <Button on:click={onSubmitClaim} disabled={submitIsDisabled} raised>Submit Claim</Button>
      {/if}
    </p>
  </Form>
</div>
