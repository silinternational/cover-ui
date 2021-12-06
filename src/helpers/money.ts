export const convertToCents = (dollars: number): number => {
  if (dollars === undefined || dollars === null) {
    return 0
  }
  return Math.round(dollars * 100) // Round to avoid #'s like 7001.000000000001
}

export const formatMoney = (cents: number): string => {
  if (!cents || !Number.isFinite(+cents)) {
    return ''
  }
  return '$' + Number(cents / 100).toFixed(2)
}
