import type { PolicyItem } from 'data/items'
import { formatDate, getYear } from 'helpers/dates'
import { formatMoney } from 'helpers/money'

export const getMonthlyCheckoutMessage = (
  item: PolicyItem,
  org: string,
  accountOrHouseholdId: string
): string => {
  const today = new Date()

  const nextMonth = new Date()
  nextMonth.setMonth(today.getMonth() + 1)
  nextMonth.setDate(1)

  if (isBeforeMonthlyCutoff(today)) {
    return `Pay ${formatMoney(item.monthly_premium)} from ${org} account ${accountOrHouseholdId} each month.`
  } else {
    const thirdMonth = new Date()
    thirdMonth.setMonth(nextMonth.getMonth() + 1)
    thirdMonth.setDate(1)

    const renewDate = formatDate(thirdMonth.toISOString())

    return `Pay ${formatMoney(item.monthly_premium)} from ${org} account ${accountOrHouseholdId} `
         + `each month, starting ${renewDate}. \n`
         + `NOTE: Coverage will begin ${formatDate(item.coverage_start_date)} if this request `
         + `for coverage is approved.`
  }
}

export const getYearlyCheckoutMessage = (
  item: PolicyItem,
  org: string,
  accountOrHouseholdId: string
): string => {
  const annualPremium = item.annual_premium
  const proratedAnnualPremium = item.prorated_annual_premium

  const startDate = formatDate(item.coverage_start_date)
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

const isBeforeMonthlyCutoff = (today: Date) => today.getUTCDate() < 20
