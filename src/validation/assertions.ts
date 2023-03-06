import type { PolicyItem } from 'data/items'
import { throwError } from '../error'
import { capitalize } from 'lodash-es'

export function assertHas(value: any, errorMessage: string): void {
  if (!value) {
    throwError(errorMessage)
  }
}

export function assertUnique(value: any, values: any[], errorMessage: string): void {
  if (value && values.includes(value)) {
    throwError(errorMessage)
  }
}

export function assertIsLessThan(value: any, high: any, errorMessage: string): void {
  if (value >= high) {
    throwError(errorMessage)
  }
}

export function assertIsLessOrEqual(value: number | string, high: number | string, errorMessage: string): void {
  if (value > high) {
    throwError(errorMessage)
  }
}

export function assertBetween(value: any, low: any, high: any, errorMessage: string): void {
  if (value > high || value < low) {
    throwError(errorMessage)
  }
}

export function assertMatches(value: any, pattern: RegExp, errorMessage: string): void {
  const match = String(value).match(pattern)
  if (!match || match[0] !== String(value)) {
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

export const assertItemCanBeUpdated = (item: PolicyItem): boolean => {
  return item.can_be_updated === true
}
