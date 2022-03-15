import { get, writable } from 'svelte/store'
import { CREATE, DELETE, GET, UPDATE } from 'data'
import type { CoverFile } from 'data/file'
import { Policy, PolicyType } from 'data/policies'
import { onClear } from 'data/storage'

export enum UserAppRole {
  Customer = 'Customer',
  Steward = 'Steward',
  Signator = 'Signator',
}

export type User = {
  app_role: UserAppRole
  country: string
  email: string
  email_override: string
  first_name: string
  id: string
  last_login_utc: string /*Date*/
  last_name: string
  name: string
  photo_file?: CoverFile
  photo_file_id?: string
  policies: Policy[]
}

export type UpdatedUserBody = {
  email_override: string
  country: string
}

const user = writable<User>({} as User)

// Update a policy in the user store when it has been updated
export function updateUserPolicyStore(updatedPolicy: Policy): void {
  user.update((user) => {
    if (user?.policies?.length > 0 && updatedPolicy?.id) {
      const idx = user.policies.findIndex((p) => p.id === updatedPolicy.id)
      if (idx !== -1) {
        user.policies[idx] = updatedPolicy
      }
    }
    return user
  })
}

export default user

export async function loadUser(forceReload?: boolean): Promise<void> {
  const alreadyLoadedUser = get(user).policies?.length > 0

  if (!alreadyLoadedUser || forceReload) {
    const userData = await GET<User>('users/me')
    user.set(userData)
    onClear(() => user.set({} as User))
  }
}

export async function updateUser(data: UpdatedUserBody): Promise<void> {
  const updatedUser = await UPDATE<User>(`users/me`, data)
  user.set(updatedUser)
}

export async function attachUserPhoto(fileId: string): Promise<void> {
  const updatedUser = await CREATE<User>(`users/me/files`, { file_id: fileId })
  user.set(updatedUser)
}

export async function deleteUserPhoto(): Promise<void> {
  await DELETE(`users/me/files`)
  user.update((user) => {
    return { ...user, photo_file: undefined, photo_file_id: undefined }
  })
}

export const isUserSteward = (userRole: UserAppRole): boolean => userRole === UserAppRole.Steward

export const isSignator = (userRole: UserAppRole): boolean => userRole === UserAppRole.Signator

export const isAdmin = (userRole: UserAppRole): boolean => isUserSteward(userRole) || isSignator(userRole)

export const isCustomer = (userRole: UserAppRole): boolean => userRole === UserAppRole.Customer

export const getDefaultPolicyId = (user: User): string => {
  const policies = user.policies || []
  const teamPolicies = policies.filter((p: Policy) => p.type === PolicyType.Team)
  const householdPolicies = policies.filter((p: Policy) => p.type === PolicyType.Household)
  const policyIdToUse = teamPolicies[0]?.id || householdPolicies[0]?.id

  return policyIdToUse
}
