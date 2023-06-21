export const convertToCents = (dollars?: number | string): number => {
  if (dollars === undefined || dollars === null) {
    return 0
  }
  return Math.round(Number(dollars) * 100) // Round to avoid #'s like 7001.000000000001
}

export const formatMoney = (cents: number): string => {
  if (!cents || !Number.isFinite(+cents)) {
    return '$0.00'
  }
  const convertToDollars = (cents: number) => '$' + Number(cents / 100).toFixed(2)

  return cents >= 0 ? convertToDollars(cents) : `(${convertToDollars(cents * -1)})`
}
