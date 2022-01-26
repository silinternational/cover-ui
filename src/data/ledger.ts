import type { PolicyType } from 'data/policies'
import type { CoverFile } from 'data/file'
import { GET, CREATE } from './index'

export type LedgerReport = {
  file: CoverFile
  ledger_entries: LedgerEntry[]
}

export type LedgerEntry = {
  id: string
  policy_id: string
  item_id: string
  claim_id: string
  entity_code: string
  risk_category_name: string
  risk_category_cc: string
  type: string
  policy_type: PolicyType
  household_id: string
  cost_center: string
  account_number: string
  income_account: string
  name: string
  amount: number
  date_submitted: string /*Date*/
  date_entered: string /*Date*/
  created_at: string /*Date*/
  updated_at: string /*Date*/
}

export async function getPolicyRenewals(): Promise<LedgerReport> {
  return await GET('ledger?report-type=annual')
}

export async function downloadPolicyRenewals(): Promise<any> {
  return await GET('ledger?report-type=annual')
}

export async function processPolicyRenewals(): Promise<void> {
  return await CREATE('ledger/annual')
}
