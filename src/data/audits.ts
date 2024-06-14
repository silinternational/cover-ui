import { CREATE } from 'data'
import type { PolicyItem } from './types/items'
import { writable } from 'svelte/store'

export type AuditResult = {
  audit_type: string
  items: PolicyItem[]
}

export type RepairsResult = {
  repair_type: string
  items: PolicyItem[]
}

export const audits = writable({} as AuditResult)
export const repairedAudits = writable({} as RepairsResult)

export const runAudits = async (date: string): Promise<void> => {
  const response = (await CREATE('audits', { audit_type: 'renewal', date })) as AuditResult
  audits.set(response)
}

export const repairAudits = async (date: string): Promise<void> => {
  const response = (await CREATE('repairs', { repair_type: 'renewal', date })) as RepairsResult

  repairedAudits.set(response)
}
