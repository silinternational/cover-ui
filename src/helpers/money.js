export const formatMoney = cents => {
  if (cents === undefined) {
    return ''
  }
  return '$' + Number(cents / 100).toFixed(2)
}
