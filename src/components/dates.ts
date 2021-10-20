export const formatDate = (dateString: string): string => {
  if (dateString) {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }

    // When the dateString does not contain a time portion, treat it as a UTC date
    if (dateString.indexOf('T') === -1) {
      options.timeZone = 'UTC'
    }
    return date.toLocaleDateString('default', options)
  }
  return ''
}
