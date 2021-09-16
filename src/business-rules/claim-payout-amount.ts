import type { PayoutOption } from '../data/claims'

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
  const repairableEventTypes = claimIncidentTypes.filter(type => type.is_repairable)
  return repairableEventTypes.some(type => type.name === incidentTypeName)
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
