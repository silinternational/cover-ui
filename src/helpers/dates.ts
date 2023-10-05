import { day } from 'components/const'

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
    const date = new Date(dateString)

    if (Math.abs(date.getTime()) < day) {
      // if the date is within a day of the epoch assume it is the epoch since local timestring could be used
      return ''
    }

    if (date.toISOString() === '0001-01-01T00:00:00.000Z') {
      return ''
    }

    if (dateString.indexOf('T') === -1) {
      // When the dateString does not contain a time portion, treat it as a UTC date
      options.timeZone = 'UTC'
    }
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

export const isFourDigitYear = (year: any): boolean => {
  const fourDigitYearRegex = /^[1-9][0-9]{3}$/
  return fourDigitYearRegex.test(String(year))
}
