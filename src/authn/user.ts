import { writable } from 'svelte/store'
import { GET, UPDATE } from 'data'

type UserAppRole = 'User' | 'Steward' | 'Signator' | 'Admin'

export type User = {
  app_role: UserAppRole
  email: string
  email_override: string
  first_name: string
  id: string
  last_login_utc: string /*Date*/
  last_name: string
  location: string
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
  policy_id: string
}

export type UpdatedUserBody = {
  email_override: string
  location: string
}

const user = writable<User>({} as User)

export default user

export async function loadUser(): Promise<void> {
  const userData = await GET<User>('users/me')
  user.set(userData)
}

export async function updateUser(data: UpdatedUserBody): Promise<void> {
  const updatedUser = await UPDATE<User>(`users/me`, data)
  user.set(updatedUser)

  user.set(data)
}

export const clear = (): void => {
  user.set({} as User)
}

export const isSteward = (user: User): boolean => user.app_role === 'Steward'
