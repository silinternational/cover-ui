import { formatDate, getYear } from 'helpers/dates'
import { formatMoney } from 'helpers/money'

export const getCheckoutMessage = (
  coverageStartDate: string | undefined,
  proratedAnnualPremium: number,
  org: string,
  accountOrHouseholdId: string,
  annualPremium: number
): string => {
  const startDate = formatDate(coverageStartDate)
  const year = getYear(startDate)
  const renewYear = Number(year) + 1
  const renewDate = formatDate(`${renewYear}-01-01`)
  const proratedMessage = `Pay ${formatMoney(proratedAnnualPremium)} for the remainder of ${year} from ${org} account
    ${accountOrHouseholdId}. Auto-renew and pay ${formatMoney(annualPremium)} on ${renewDate}.`
  const noPaymentMessage = `No payment needed right now. Auto-renew for ${formatMoney(
    annualPremium
  )} on ${renewDate}, paid from ${org}
     account ${accountOrHouseholdId}.`
  return proratedAnnualPremium > 100 ? proratedMessage : noPaymentMessage
}
