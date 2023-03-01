import type { PolicyItem } from './items'
import { CREATE } from 'data'

export type AuditResult = {
  AuditType: string
  Items: PolicyItem[]
}

export const runAudits = async (date: string): Promise<AuditResult> => {
  const response = (await CREATE('audits', { audit_type: 'renewal', Date: date })) as AuditResult
  return response
}
