import { MonthlyCutoffDay } from 'data/items'

export const isBeforeMonthlyCutoff = () => {
  const today = new Date()
  return today.getUTCDate() < MonthlyCutoffDay
}
