export const convertToCents = (dollars) => {
  if (dollars === undefined || dollars === null) {
    return null
  }
  return Math.round(dollars * 100) // Round to avoid #'s like 7001.000000000001
}

export const formatMoney = (cents) => {
  if (!cents || !Number.isFinite(+cents)) {
    return ''
  }
  return '$' + Number(cents / 100).toFixed(2)
}
