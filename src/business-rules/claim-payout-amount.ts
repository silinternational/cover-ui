import type { PayoutOption, ClaimItem } from '../data/claims'

export const deductible = .05
export const LOSS_REASON_EVACUATION = 'Evacuation'

export const PAYOUT_OPTION_FIXED_FRACTION: PayoutOption = 'FixedFraction'
export const PAYOUT_OPTION_FMV: PayoutOption = 'FMV'
export const PAYOUT_OPTION_REPAIR: PayoutOption = 'Repair'
export const PAYOUT_OPTION_REPLACE: PayoutOption = 'Replacement'

export const isFairMarketValueNeeded = (isRepairable, payoutOption) => {
  return isRepairable || (payoutOption === PAYOUT_OPTION_FMV)
}

export const isPotentiallyRepairable = (claimIncidentTypes, incidentTypeName) => {
  if (!incidentTypeName) {
    return true
  }
  if (claimIncidentTypes.length < 1) {
    return true
  }
  const repairableIncidentTypes = claimIncidentTypes.filter(type => type.is_repairable)
  return repairableIncidentTypes.some(type => type.name === incidentTypeName)
}

export const isRepairCostTooHigh = (repairEstimateUSD, fairMarketValueUSD) => {
  if (!repairEstimateUSD) {
    return undefined
  }
  if (!fairMarketValueUSD) {
    return undefined
  }
  const seventyPercentFMV = 0.7 * fairMarketValueUSD
  return repairEstimateUSD >= seventyPercentFMV
}

export const isUnrepairableOrTooExpensive = (isRepairable, repairCostIsTooHigh) => {
  if (isRepairable === false) {
    return true
  }
  
  if ((isRepairable === undefined) || (repairCostIsTooHigh === undefined)) {
    return undefined
  }
  
  return repairCostIsTooHigh
}

const computePayout = (...values) => {
  const filteredValues = [...values]?.filter(value => value !== undefined)
  return Math.min(...filteredValues) * (1 - deductible)
}

const computeRepairMaxPayout = (claimItem: ClaimItem, coverageAmount) => computePayout(claimItem.repair_actual || claimItem.repair_estimate, coverageAmount, claimItem.fmv)

const computeReplaceMaxPayout = (claimItem: ClaimItem, coverageAmount) => computePayout(claimItem.replace_estimate, coverageAmount)

const computeCashMaxPayout = (claimItem: ClaimItem, coverageAmount) => computePayout(coverageAmount, claimItem.fmv)

export const determineMaxPayout = (payoutOption: PayoutOption, claimItem: ClaimItem, coverageAmount) => {
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
      return coverageAmount * 2/3
      break
    default:
      return undefined
  }
}
