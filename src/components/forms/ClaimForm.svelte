<script lang="ts">
import {
  calculateIsRepairable,
  determinePayoutOption,
  isFairMarketValueNeeded,
  isPotentiallyRepairable,
  isRepairCostTooHigh,
  isUnrepairableOrTooExpensive,
  LOSS_REASON_EVACUATION,
} from '../../business-rules/claim-payout-amount'
import { validateForDraft, validateForFinalSubmission, validateFormOnContinue } from './claims/claimFormHelpers'
import { ItemSelector, LossReasonRadioOptions, PayoutRadioOptions, RepairableRadioOptions } from './claims/_components'
import { MAX_TEXT_AREA_LENGTH as maxlength } from 'components/const'
import ConvertCurrencyLink from '../ConvertCurrencyLink.svelte'
import { Claim, ClaimItem, PayoutOption } from 'data/claims'
import type { PolicyItem } from 'data/types/items'
import { claimIncidentTypes, loadClaimIncidentTypes } from 'data/types/claim-incident-types'
import Description from '../Description.svelte'
import { formatMoney } from 'helpers/money'
import InfoModal from '../InfoModal.svelte'
import type { ClaimFormData } from './claims/types'
import { Button, DateInput, Form, IconButton, MoneyInput, TextArea } from '@silintl/ui-components'
import { createEventDispatcher, onMount } from 'svelte'

export let claim = {} as Claim
export let item = {} as PolicyItem
export let items: PolicyItem[] = []

const dispatch = createEventDispatcher()

const fmvExplanation =
  'Fair Market Value: FMV is the price that a given item of "like kind and quality" would reasonably sell for within your marketplace.'
const todayDateString = new Date().toISOString()

let fmvModalOpen = false
let showLossError = false
let showPayoutError = false
let showFmvError = false
let showDescriptionError = false
let showRepairError = false
let showReplaceError = false
// Set default form values.
let lostDate = todayDateString.split('T')[0]
let lossReason: string
let situationDescription: string
let isRepairable: boolean | undefined
let payoutOption: PayoutOption | undefined

// Set default derived (or intermediate) values.
let claimItem = {} as ClaimItem
let claimItems: ClaimItem[] = []
let isEvacuation: boolean
let potentiallyRepairable = true
let repairableSelection: string | undefined
let repairCostIsTooHigh: boolean | undefined
let shouldAskForFMV = false
let shouldAskReplaceOrFMV = false
let unrepairableOrTooExpensive: boolean | undefined
let repairEstimateUSD: number | undefined
let replaceEstimateUSD: number | undefined
let fairMarketValueUSD: number | undefined

// Load the necessary data.
onMount(() => {
  $claimIncidentTypes.length || loadClaimIncidentTypes()
  setInitialValues(claim, claimItem)
})

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
$: shouldAskForFMV = isFairMarketValueNeeded(isRepairable, payoutOption)
$: payoutOption !== PayoutOption.Replacement && unSetReplaceEstimate()
$: !shouldAskReplaceOrFMV && unSetPayoutOption()
$: !shouldAskForFMV && unSetFairMarketValue()
$: !isRepairable && unSetRepairEstimate()
$: !isRepairable && (repairCostIsTooHigh = undefined) //above line should make this happen but it doesn't
$: needsEvidence = !unrepairableOrTooExpensive || payoutOption === PayoutOption.FMV
$: needsPayoutOption = !(isRepairable || isEvacuation) || repairCostIsTooHigh

// TODO: add reimbursed value

const onSubmitClaim = () => {
  setErrors()
  const formData = getFormData()
  validateForFinalSubmission(
    formData,
    potentiallyRepairable,
    repairableSelection,
    needsPayoutOption,
    payoutOption,
    replaceEstimateUSD
  )
  dispatch('submit', formData)
}

const onSaveForLater = () => {
  validateForDraft(item.id, lossReason, situationDescription)
  dispatch('save-for-later', getFormData())
}

const onContinue = () => {
  setErrors()
  validateForDraft(item.id, lossReason, situationDescription)
  validateFormOnContinue(repairEstimateUSD, fairMarketValueUSD, isRepairable)
  dispatch('save-for-later', getFormData())
}
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    setErrors()
  }
}

const setErrors = () => {
  showLossError = !lossReason
  showPayoutError = !!needsPayoutOption && !payoutOption
  showRepairError = !!isRepairable && !Number(repairEstimateUSD)
  showReplaceError = payoutOption === PayoutOption.Replacement && !Number(replaceEstimateUSD)
  showFmvError = shouldAskForFMV && !Number(fairMarketValueUSD)
  showDescriptionError = !situationDescription
}

const getFormData = (): ClaimFormData => {
  const date = lostDate === todayDateString.split('T')[0] ? todayDateString : lostDate
  return {
    claimData: {
      lostDate: date,
      lossReason,
      situationDescription,
    },
    claimItemData: {
      itemId: item.id,
      isRepairable: !!isRepairable, //will the backend accept undefined?
      payoutOption: determinePayoutOption(isEvacuation, repairCostIsTooHigh, payoutOption) as PayoutOption,
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
  repairableSelection =
    typeof claimItem.is_repairable !== 'boolean' || claimItem.is_repairable ? 'repairable' : 'not_repairable'

  payoutOption = claimItem.payout_option || payoutOption

  repairEstimateUSD = claimItem.repair_estimate / 100
  replaceEstimateUSD = claimItem.replace_estimate / 100
  fairMarketValueUSD = claimItem.fmv / 100
}

function unSetPayoutOption() {
  payoutOption = undefined
}
function unSetFairMarketValue() {
  fairMarketValueUSD = undefined
}
function unSetRepairEstimate() {
  repairEstimateUSD = undefined
}
function unSetReplaceEstimate() {
  replaceEstimateUSD = undefined
}
function onInfoClick(event: Event) {
  event.preventDefault()
  fmvModalOpen = true
}
</script>

<div class="w-50">
  {#if items?.length}
    <ItemSelector on:change {items} />
  {:else}
    <div class="item-name">{item.name}</div>
  {/if}
  <div>Covered value: {formatMoney(item.coverage_amount)}</div>
  <Form>
    <p>
      <span class="header">Date lost or damaged</span>
      <DateInput required bind:value={lostDate} />
    </p>
    <LossReasonRadioOptions showError={showLossError} bind:lossReason on:change={() => (showLossError = false)} />
    <p>
      <span class="header">What happened?</span>
      <TextArea
        {maxlength}
        required
        description="Describe the situation"
        bind:value={situationDescription}
        rows="4"
        showError={showDescriptionError}
        on:blur={() => (showDescriptionError = false)}
      />
    </p>
    <RepairableRadioOptions bind:repairableSelection {potentiallyRepairable} {lossReason} />
    {#if isRepairable}
      <p>
        <MoneyInput
          class="tw-w-80 tw-max-w-full"
          label="Repair estimate (USD)"
          required
          minValue={'0'}
          bind:value={repairEstimateUSD}
          showError={showRepairError}
          on:blur={() => (showRepairError = false)}
        />
        <Description>
          <div>How much will it probably cost to be repaired?</div>
          <ConvertCurrencyLink />
        </Description>
      </p>
      <p>
        <!-- If it's repairable, position this BEFORE the "Payout options" prompt. -->
        <span class="tw-flex">
          <div>
            <MoneyInput
              label="Fair market value (USD)"
              class="tw-w-80 tw-max-w-full"
              required
              minValue={'0'}
              bind:value={fairMarketValueUSD}
              showError={showFmvError}
            />
          </div>
          <IconButton class="gray mt-4px" icon="info" on:click={onInfoClick} />
        </span>
        <Description>
          <ConvertCurrencyLink />
        </Description>
      </p>
    {/if}

    {#if shouldAskReplaceOrFMV}
      <PayoutRadioOptions showError={showPayoutError} on:change={() => (showPayoutError = false)} bind:payoutOption />
      {#if payoutOption === PayoutOption.Replacement}
        <p>
          <MoneyInput
            label="Replacement estimate (USD)"
            class="tw-w-80 tw-max-w-full"
            required
            minValue={'0'}
            bind:value={replaceEstimateUSD}
            showError={showReplaceError}
            on:blur={() => (showReplaceError = false)}
          />
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
        <span class="tw-flex">
          <div>
            <MoneyInput
              label="Fair market value (USD)"
              class="tw-w-80 tw-max-w-full"
              required
              minValue={'0'}
              bind:value={fairMarketValueUSD}
              showError={showFmvError}
            />
          </div>
          <IconButton class="gray mt-4px" icon="info" on:click={onInfoClick} />
        </span>
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
      <Button on:click={onSaveForLater} outlined>Save For Later</Button>
      {#if needsEvidence}
        <Button on:click={onContinue} on:onkeydown={onKeydown} raised>Continue</Button>
      {:else}
        <Button on:click={onSubmitClaim} on:onkeydown={onKeydown} raised>Submit Claim</Button>
      {/if}
    </p>
  </Form>

  <InfoModal content={fmvExplanation} title="Fair Market Value" bind:open={fmvModalOpen} />
</div>
