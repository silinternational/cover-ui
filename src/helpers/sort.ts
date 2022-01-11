import type { Claim } from 'data/claims'
import type { PolicyItem } from 'data/items'

export const compare = (first: string, second: string, ascending: boolean): number => {
  if (ascending) {
    if (first < second) return -1
    if (first > second) return 1
  } else {
    if (first > second) return -1
    if (first < second) return 1
  }
  return 0
}

export const sortByNum = (path: string, items: PolicyItem[] | Claim[], ascending: boolean): PolicyItem[] | Claim[] =>
  ascending
    ? items.sort((a, b) => (resolvePath(a, path) || 0) - (resolvePath(b, path) || 0))
    : items.sort((a, b) => (resolvePath(b, path) || 0) - (resolvePath(a, path) || 0))

export const sortByString = (path: string, items: any[], ascending: boolean): any[] =>
  items.sort((a, b) => compare(resolvePath(a, path) || ' ', resolvePath(b, path) || ' ', ascending))

//on myObj.arr[0].prop path will be 'arr.0.prop'
export const resolvePath = (object: PolicyItem | Claim, path: string): any =>
  path?.split('.').reduce((o, p) => (o ? o[p] : ''), object)
