export const convertToCents = (dollars?: number | string): number => {
  if (dollars === undefined || dollars === null) {
    return 0
  }
  return Math.round(Number(dollars) * 100) // Round to avoid #'s like 7001.000000000001
}

export const formatMoney = (cents: number | undefined): string => {
  if (cents === undefined) {
    return ''
  }
  if (!cents || !Number.isFinite(+cents)) {
    cents = 0
  }

  const convertToDollars = (cents: number): string => {
    return Number(cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
  }

  return cents >= 0 ? convertToDollars(cents) : `(${convertToDollars(cents * -1)})`
}
