
export const LOSS_REASON_EVACUATION = 'Evacuation'

export const PAYOUT_OPTION_FIXED_FRACTION = 'FixedFraction'
export const PAYOUT_OPTION_FMV = 'FMV'
export const PAYOUT_OPTION_REPAIR = 'Repair'
export const PAYOUT_OPTION_REPLACE = 'Replace'

export const isFairMarketValueNeeded = (isRepairable, payoutOption) => {
  return isRepairable || (payoutOption === PAYOUT_OPTION_FMV)
}

export const isPotentiallyRepairable = (claimEventTypes, eventTypeName) => {
  if (!eventTypeName) {
    return true
  }
  if (claimEventTypes.length < 1) {
    return true
  }
  const repairableEventTypes = claimEventTypes.filter(type => type.is_repairable)
  return repairableEventTypes.some(type => type.name === eventTypeName)
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
