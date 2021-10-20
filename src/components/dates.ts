export const formatDate = (dateString: string): string => {
  if (dateString) {
    const date = new Date(dateString)
    // When dateString does not contain a timezone component, javascript will apply the current timezone offset
    // This means that if you are parsing the date '2020-01-01' and are currently in a '-4' timezone then js
    // will unexpectedly display the date as 8pm on 2019-12-31
    // Because we do *not* want this, we can add those 4 hours back into the date so that when js later removes them
    // it will be correctly formatted as midnight 2020-01-01
    if (dateString.indexOf('T') === -1) {
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    }
    return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })
  }
  return ''
}
