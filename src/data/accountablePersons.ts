import type { PolicyItem } from './items'

export const getAccountablePerson = (item: PolicyItem, persons: any) => {
  const id: string = item.accountable_user_id || item.accountable_dependent_id
  return persons?.find((person: any) => person.id === id)?.name || ''
}
