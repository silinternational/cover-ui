import type { PolicyItem } from './items'
import { CREATE } from 'data'
import { writable } from 'svelte/store'

export type AuditResult = {
  AuditType: string
  Items: PolicyItem[]
}

export const audits = writable({} as AuditResult)
export const repairedAudits = writable({} as AuditResult)

export const runAudits = async (date: string): Promise<void> => {
  const response = (await CREATE('audits', { audit_type: 'renewal', Date: date })) as AuditResult
  audits.set(response)
}

export const repairAudits = async (date: string): Promise<void> => {
  const response = (await CREATE('audits', { audit_type: 'repair', Date: date })) as AuditResult

  repairedAudits.set(response)
  audits.set({} as AuditResult)
}
