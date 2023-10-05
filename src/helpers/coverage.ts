import { BillingPeriod, isItemDraft, itemIsApproved, MonthlyCutoffDay, PolicyItem } from 'data/items'
import { formatDate, startOfFutureMonth } from 'helpers/dates'
import { formatMoney } from 'helpers/money'

const getMonthlyRenewalDate = (item: PolicyItem): string => {
  if (itemIsApproved(item)) {
    return startOfFutureMonth(1)
  }

  if (isItemDraft(item)) {
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
  return formatDate(item.coverage_start_date) || '(when approved)'
}

const getYearlyRenewalDate = (item: PolicyItem): string => {
  const renewYear = new Date().getFullYear() + 1
  return formatDate(`${renewYear}-01-01`)
}

export const isBeforeMonthlyCutoff = () => {
  const today = new Date()
  return today.getUTCDate() < MonthlyCutoffDay
}

const isMonthly = (item: PolicyItem) => item.billing_period === BillingPeriod.Monthly
