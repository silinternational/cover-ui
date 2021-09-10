
export const convertToCents = dollars => {
  if (dollars === undefined || dollars === null) {
    return null
  }
  return dollars * 100
}

export const formatMoney = cents => {
  if (cents === undefined) {
    return ''
  }
  return '$' + Number(cents / 100).toFixed(2)
}
