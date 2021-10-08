import { throwError } from '../error'

export function assertHas(value: any, errorMessage: string): void {
  if (!value) {
    throwError(errorMessage)
  }
}

//TODO find alternative to regex validation
export function assertEmailAddress(email: string, errorMessage: string): void {
  const simpleEmailRegex = /\S+@\S+\.\S+/

  if (!simpleEmailRegex.test(email)) {
    throwError(errorMessage)
  }
}
