import { day } from 'components/const'
import type { PolicyItem } from 'data/items'

export const formatFriendlyDate = (dateTimeString: string): string => {
  if (dateTimeString?.includes('0001-01-01') || new Date(dateTimeString).toDateString() === 'Invalid Date') {
    return ''
  }

  return formatDate(dateTimeString.split('T')[0], { month: 'numeric', day: 'numeric', year: 'numeric' })
}

/**
 * Take a date string and format it for display to the user. If no timezone is included in the date
 * string, UTC is assumed. Returns an empty string for date strings that probably indicate no-data
 * (such as a date near the Unix epoch, or a date like "0001-01-01").
 */
export const formatDate = (
  dateString: string | undefined,
  options: Intl.DateTimeFormatOptions | undefined = { month: 'long', day: 'numeric', year: 'numeric' }
): string => {
  if (dateString) {
    if (!isMeaningfulDateString(dateString)) {
      return ''
    }

    if (dateString.indexOf('T') === -1) {
      // When the dateString does not contain a time portion, treat it as a UTC date
      options.timeZone = 'UTC'
    }

    const date = new Date(dateString)
    return date.toLocaleDateString('default', options)
  }
  return ''
}

export const getYear = (dateString: string): string => {
  if (dateString) {
    const date = new Date(dateString)
    const yyyy = dateString.indexOf('T') === -1 ? date.getUTCFullYear().toString() : date.getFullYear().toString()
    return yyyy
  }
  return ''
}

export const formatDateAndTime = (
  dateString: string,
  options: Intl.DateTimeFormatOptions | undefined = { month: 'long', day: 'numeric', year: 'numeric' }
): string => {
  if (dateString) {
    const date = new Date(dateString)
    if (Math.abs(date.getTime()) < day) {
      // if the date is within a day of the epoch assume it is the epoch since local timestring could be used
      return ''
    }
    // When the dateString does not contain a time portion, treat it as a UTC date
    if (dateString.indexOf('T') === -1) {
      options.timeZone = 'UTC'
    }
    return date.toLocaleTimeString('default', options)
  }
  return ''
}

/**
 * Get formatted date string for the 1st day of the specified month.
 */
export const startOfFutureMonth = (offsetInMonths: number = 0): string => {
  const targetDate = new Date()
  targetDate.setMonth(targetDate.getMonth() + offsetInMonths)
  targetDate.setDate(1)
  return formatDate(targetDate.toISOString())
}

export const isFourDigitYear = (year: any): boolean => {
  const fourDigitYearRegex = /^[1-9][0-9]{3}$/
  return fourDigitYearRegex.test(String(year))
}

export const isMeaningfulDateString = (dateString: string | undefined): boolean => {
  if (!dateString) {
    return false
  }

  const date = new Date(dateString)

  if (Math.abs(date.getTime()) < day) {
    // If the date is within a day of the epoch, assume it is the epoch since a local time string
    // could have been used.
    return false
  }

  if (date.toISOString() === '0001-01-01T00:00:00.000Z') {
    return false
  }

  return true
}

export const dateIsInThePast = (dateString: string): boolean => {
  const date = new Date(dateString)
  return date < new Date()
}

export const isItemActiveByDates = (item: PolicyItem): boolean => {
  const today = new Date()
  const start = new Date(item.coverage_start_date)
  const end = item.coverage_end_date ? new Date(item.coverage_end_date) : new Date()
  return start <= today && today <= end
}

export const isOlderThanDays = (dateString: string, days: number): boolean => {
  const date = new Date(dateString)
  const today = new Date()
  const diff = today.getTime() - date.getTime()
  return diff > days * day
}
