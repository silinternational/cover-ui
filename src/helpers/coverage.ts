export const isBeforeMonthlyCutoff = () => {
  const today = new Date()
  return today.getUTCDate() < 20
}
