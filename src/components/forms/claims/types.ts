import type { PayoutOption } from 'data/claims'

export type ClaimItemData = {
  itemId: string
  isRepairable: boolean
  payoutOption: PayoutOption
  repairEstimateUSD?: number
  replaceEstimateUSD?: number
  fairMarketValueUSD?: number
  repairActual?: number
  replaceActual?: number
}

export type ClaimData = {
  lossReason: string
  lostDate: string //date
  situationDescription: string
}

export type ClaimFormData = {
  claimData: ClaimData
  claimItemData: ClaimItemData
}
