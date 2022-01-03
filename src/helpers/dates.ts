export const formatFriendlyDate = (dateTimeString: string): string =>
  new Date(dateTimeString).toDateString() !== 'Invalid Date'
    ? formatDate(dateTimeString.split('T')[0], { month: 'numeric', day: 'numeric', year: 'numeric' })
    : ''

export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions | undefined = { month: 'long', day: 'numeric', year: 'numeric' }
): string => {
  if (dateString) {
    const date = new Date(dateString)

    // When the dateString does not contain a time portion, treat it as a UTC date
    if (dateString.indexOf('T') === -1) {
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
