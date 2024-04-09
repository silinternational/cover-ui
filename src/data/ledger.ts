import type { PolicyType } from 'data/policies'
import type { CoverFile } from 'data/file'
import { CREATE, GET, UPDATE } from './index'
import { writable } from 'svelte/store'

export type LedgerReport = {
  id: string
  file: CoverFile
  type: string
  date: string
  is_cleared: boolean
  transaction_count: number
  created_at: string
  updated_at: string
}

export type CreateLedgerReportInput = {
  // Report date, e.g. return the ledger entries prior to the given date. Details vary by the report type.
  date: string
  type: LedgerReportType
}

// Ledger report types:
// + `monthly` - Return all ledger entries not yet reconciled, up to the beginning of the given date.
// + `annual` - Return the policy renewal entries for the year of the given date.
export enum LedgerReportType {
  annual = 'Annual',
  monthly = 'Monthly',
}

// LedgerEntry is not currently in use, but will hold it for future use
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

export type PolicyLedgerEntries = {
  assigned_to: string
  date: string //Date
  item_name: string
  location: string
  status_after: string
  status_before: string
  type: string
  value: number
}

export type PolicyReportData = {
  coverage_value: number
  entries: PolicyLedgerEntries[]
  last_changed: string //date
  net_transactions: number
  payout_total: number
  premium_rate: number
  premium_total: number
  report_month: number
  report_year: number
}

export type RenewalStatus = {
  is_complete: boolean
  items_to_process: number
  safe_to_process: boolean
}

export const LedgerReports = writable<LedgerReport[]>([])

function updateLedgerReports(report: LedgerReport) {
  LedgerReports.update((reports) => {
    const index = reports.findIndex((r) => r.id === report.id)
    if (index < 0) {
      reports.push(report)
    } else {
      reports[index] = report
    }
    return reports
  })
}

function updatePolicyLedgerReports(report: LedgerReport) {
  policyLedgerReports.update((reports) => {
    const index = reports.findIndex((r) => r.id === report.id)
    if (index < 0) {
      reports.push(report)
    } else {
      reports[index] = report
    }
    return reports
  })
}

export async function getLedgerReports(): Promise<LedgerReport[]> {
  const result: LedgerReport[] = await GET('ledger-reports')
  LedgerReports.set(result)
  return result
}

export async function getLedgerReportById(id: string, isPolicyReport = false): Promise<LedgerReport> {
  const result: LedgerReport = await GET(`ledger-reports/${id}`)
  isPolicyReport ? updatePolicyLedgerReports(result) : updateLedgerReports(result)
  return result
}

export async function getLedgerEntriesByPolicyId(id: string, month: string, year: string): Promise<PolicyReportData> {
  const result: PolicyReportData = await GET(`policies/${id}/ledger-reports?month=${month}&year=${year}`)
  return result
}

export async function createLedgerReport(type: LedgerReportType, date: string): Promise<LedgerReport> {
  const params: CreateLedgerReportInput = {
    date,
    type,
  }
  const result: LedgerReport = await CREATE('ledger-reports', params)
  updateLedgerReports(result)
  return result
}

export const policyLedgerReports = writable<LedgerReport[]>([])

export async function createPolicyLedgerReport(
  policyId: string,
  type: LedgerReportType,
  month: number,
  year: number
): Promise<LedgerReport> {
  const params = {
    type,
    month,
    year,
  }
  const response: LedgerReport = await CREATE(`policies/${policyId}/ledger-reports`, params)
  if (response.id) {
    policyLedgerReports.update((reports) => [...reports, response])
  }
  return response
}

export async function reconcileLedgerReport(reportId: string): Promise<LedgerReport> {
  return await UPDATE(`ledger-reports/${reportId}`)
}

export async function processAnnualPolicyRenewals(): Promise<void> {
  return await CREATE('ledger-reports/annual')
}

export async function processMonthlyPolicyRenewals(): Promise<void> {
  return await CREATE('ledger-reports/monthly')
}

export async function getAnnualPolicyRenewalStatus(): Promise<RenewalStatus> {
  return await GET('ledger-reports/annual')
}

export async function getMonthlyPolicyRenewalStatus(): Promise<RenewalStatus> {
  return await GET('ledger-reports/monthly')
}
