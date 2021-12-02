const iso8601dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/

const isJustDate = (dateTimeString: string) => iso8601dateRegex.test(dateTimeString)

export const formatFriendlyDate = (dateTimeString: string) => {
  if (isJustDate(dateTimeString)) {
    // Note:
    // Adding a time causes the date to be interpreted as local (not UTC), which
    // protects against timezone issues causing a different date to be shown.
    dateTimeString += ' 00:00:00'
  }
  const date = new Date(dateTimeString)
  return date.toLocaleDateString()
}
