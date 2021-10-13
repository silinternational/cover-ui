import type { ClaimIncidentType } from 'data/claim-incident-types'
import type { PayoutOption, ClaimItem, ClaimStatus } from 'data/claims'

export const DEDUCTIBLE = 0.05
export const LOSS_REASON_EVACUATION = 'Evacuation'

export const PAYOUT_OPTION_FIXED_FRACTION: PayoutOption = 'FixedFraction'
export const PAYOUT_OPTION_FMV: PayoutOption = 'FMV'
export const PAYOUT_OPTION_REPAIR: PayoutOption = 'Repair'
export const PAYOUT_OPTION_REPLACE: PayoutOption = 'Replacement'

export const isFairMarketValueNeeded = (isRepairable?: boolean, payoutOption?: string): boolean => {
  return isRepairable || payoutOption === PAYOUT_OPTION_FMV
}

export const isPotentiallyRepairable = (claimIncidentTypes: ClaimIncidentType[], incidentTypeName: string): boolean => {
  if (!incidentTypeName) {
    return true
  }
  if (claimIncidentTypes.length < 1) {
    return true
  }
  const repairableIncidentTypes = claimIncidentTypes.filter((type) => type.is_repairable)
  return repairableIncidentTypes.some((type) => type.name === incidentTypeName)
}

export const isRepairCostTooHigh = (repairEstimateUSD?: number, fairMarketValueUSD?: number): boolean | undefined => {
  if (!repairEstimateUSD) {
    return undefined
  }
  if (!fairMarketValueUSD) {
    return undefined
  }
  const seventyPercentFMV = 0.7 * fairMarketValueUSD
  return repairEstimateUSD >= seventyPercentFMV
}

export const isUnrepairableOrTooExpensive = (
  isRepairable?: boolean,
  repairCostIsTooHigh?: boolean
): boolean | undefined => {
  if (isRepairable === false) {
    return true
  }

  if (isRepairable === undefined || repairCostIsTooHigh === undefined) {
    return undefined
  }

  return repairCostIsTooHigh
}

const computePayout = (...values: number[]) => {
  const filteredValues = [...values]?.filter((value) => value !== undefined)
  return Math.min(...filteredValues) * (1 - DEDUCTIBLE)
}

const computeRepairMaxPayout = (claimItem: ClaimItem, coverageAmount: number) =>
  computePayout(claimItem.repair_actual || claimItem.repair_estimate, coverageAmount, claimItem.fmv)

const computeReplaceMaxPayout = (claimItem: ClaimItem, coverageAmount: number) =>
  computePayout(claimItem.replace_estimate, coverageAmount)

const computeCashMaxPayout = (claimItem: ClaimItem, coverageAmount: number) =>
  computePayout(coverageAmount, claimItem.fmv)

export const determineMaxPayout = (
  payoutOption: PayoutOption,
  claimItem: ClaimItem,
  coverageAmount: number
): number | undefined => {
  switch (payoutOption) {
    case PAYOUT_OPTION_REPAIR:
      return computeRepairMaxPayout(claimItem, coverageAmount)
      break
    case PAYOUT_OPTION_REPLACE:
      return computeReplaceMaxPayout(claimItem, coverageAmount)
      break
    case PAYOUT_OPTION_FMV:
      return computeCashMaxPayout(claimItem, coverageAmount)
      break
    case PAYOUT_OPTION_FIXED_FRACTION:
      return (coverageAmount * 2) / 3
      break
    default:
      return undefined
  }
}

export const isEvidenceNeeded = (claimItem: ClaimItem, claimStatus: ClaimStatus): boolean => {
  const willNeedEvidence = claimItem.fmv > 0 || claimItem.repair_estimate > 0
  const canProvideEvidenceNow = ['Draft'].includes(claimStatus)
  return willNeedEvidence && canProvideEvidenceNow
}
