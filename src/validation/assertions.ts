import { throwError } from '../error'

export function assertHas(value, errorMessage) {
  if (!value) {
    throwError(errorMessage)
  }
}

export function assertEmailAddress(email, errorMessage) {
  const simpleEmailRegex = /\S+@\S+\.\S+/

  if (!simpleEmailRegex.test(email)) {
    throwError(errorMessage)
  }
}
