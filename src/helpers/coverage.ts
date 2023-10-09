import { BillingPeriod, itemIsDraft, itemIsApproved, MonthlyCutoffDay, PolicyItem } from 'data/items'
import { formatDate, isMeaningfulDateString, startOfFutureMonth } from 'helpers/dates'
import { formatMoney } from 'helpers/money'

const getMonthlyRenewalDate = (item: PolicyItem): string => {
  if (itemIsApproved(item)) {
    return startOfFutureMonth(1)
  }

  if (itemIsDraft(item)) {
    if (isBeforeMonthlyCutoff()) {
      return startOfFutureMonth(1)
    } else {
      return startOfFutureMonth(2)
    }
  }

  return ''
}

export const getPremiumDescription = (item: PolicyItem | undefined): string => {
  if (!item || !item.id) {
    return ''
  }

  if (isMonthly(item)) {
    return `${formatMoney(item.monthly_premium)} / month`
  }

  return `${formatMoney(item.annual_premium)} / year`
}

export const getRenewalDate = (item: PolicyItem | undefined): string => {
  if (!item || !item.id) {
    return ''
  }

  if (isMonthly(item)) {
    return getMonthlyRenewalDate(item)
  }

  return getYearlyRenewalDate(item)
}

export const getStartDate = (item: PolicyItem): string => {
  if (isMeaningfulDateString(item.coverage_start_date)) {
    return formatDate(item.coverage_start_date)
  }

  if (itemIsDraft(item)) {
    return '(when approved)'
  }

  return ''
}

const getYearlyRenewalDate = (item: PolicyItem): string => {
  const renewYear = new Date().getFullYear() + 1
  return formatDate(`${renewYear}-01-01`)
}

export const isBeforeMonthlyCutoff = () => {
  const today = new Date()
  return today.getUTCDate() < MonthlyCutoffDay
}

export const isMonthly = (item: PolicyItem) => item.billing_period === BillingPeriod.Monthly
