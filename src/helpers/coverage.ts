import { BillingPeriod, itemIsDraft, itemIsApproved, itemIsPending, MonthlyCutoffDay, PolicyItem } from 'data/items'
import { formatDate, isMeaningfulDateString, startOfFutureMonth } from 'helpers/dates'
import { formatMoney } from 'helpers/money'

const getMonthlyRenewalDate = (item: PolicyItem): string => {
  if (itemIsApproved(item)) {
    return startOfFutureMonth(1)
  }

  if (itemIsDraft(item) || itemIsPending(item)) {
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

  return getYearlyRenewalDate()
}

export const getStartDate = (item: PolicyItem): string => {
  if (isMeaningfulDateString(item.coverage_start_date)) {
    return formatDate(item.coverage_start_date)
  }

  if (itemIsDraft(item) || itemIsPending(item)) {
    return '(when approved)'
  }

  return ''
}

const getYearlyRenewalDate = (): string => {
  const renewYear = new Date().getFullYear() + 1
  return formatDate(`${renewYear}-01-01`)
}

export const isBeforeMonthlyCutoff = (): boolean => {
  const today = new Date()
  return today.getUTCDate() < MonthlyCutoffDay
}

export const isMonthly = (item: PolicyItem) => item.billing_period === BillingPeriod.Monthly
