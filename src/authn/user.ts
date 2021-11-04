import { get, writable } from 'svelte/store'
import { CREATE, GET, UPDATE } from 'data'
import type { Policy } from 'data/policies'

export enum UserAppRole {
  Customer = 'Customer',
  Steward = 'Steward',
  Signator = 'Signator',
  Admin = 'Admin',
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
  photo_file: {
    content_type: string
    created_by_id: string
    id: string
    name: string
    size: number
    url: string
    url_expiration: string /*Date*/
  }
  photo_file_id: string
  policies: Policy[]
  policy_id: string
}

export type UpdatedUserBody = {
  email_override: string
  country: string
}

const user = writable<User>({} as User)

export default user

export async function loadUser(forceReload?: boolean): Promise<void> {
  const alreadyLoadedUser = get(user).policy_id

  if (!alreadyLoadedUser || forceReload) {
    const userData = await GET<User>('users/me')
    user.set(userData)
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

export const clear = (): void => {
  user.set({} as User)
}

export const isUserSteward = (user: User): boolean => user.app_role === UserAppRole.Steward

export const isSignator = (user: User): boolean => user.app_role === UserAppRole.Signator

export const isAdmin = (user: User): boolean =>
  isUserSteward(user) || isSignator(user) || user.app_role === UserAppRole.Admin

export const isCustomer = (user: User): boolean => !isUserSteward(user) && !isSignator(user) && !!user.app_role
