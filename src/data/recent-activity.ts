import { GET } from '.'
import type { Claim } from './claims'
import type { PolicyItem } from './items'
import { derived, writable } from 'svelte/store'

export type RecentClaim = {
  Claim: Claim
  StatusUpdatedAt: string /* Date */
}
export function isRecentClaim(obj: any): obj is RecentClaim {
  return !!((obj as RecentClaim)?.Claim && (obj as RecentClaim)?.StatusUpdatedAt)
}

export type RecentItem = {
  Item: PolicyItem
  StatusUpdatedAt: string /* Date */
}
export function isRecentItem(obj: any): obj is RecentItem {
  return !!((obj as RecentItem)?.Item && (obj as RecentItem)?.StatusUpdatedAt)
}

export type RecentChange = RecentClaim | RecentItem

export type RecentActivity = {
  Claims: RecentClaim[]
  Items: RecentItem[]
}

export const recentActivity = writable<RecentActivity>()
export const recentChanges = derived(recentActivity, (recentActivity) => {
  if (!recentActivity) return []

  const recentClaims = recentActivity.Claims
  const recentItems = recentActivity.Items
  const mergedRecentObjects = [...recentClaims, ...recentItems]

  mergedRecentObjects.sort((a: RecentChange, b: RecentChange) => {
    const dateA = new Date(a.StatusUpdatedAt)
    const dateB = new Date(b.StatusUpdatedAt)
    return Number(dateB) - Number(dateA)
  })

  return mergedRecentObjects as RecentChange[]
})

/**
 * Load the list of recent activity.
 *
 * @export
 */
export async function loadRecentActivity(): Promise<void> {
  const urlPath = 'steward/recent'
  const result = await GET<RecentActivity>(urlPath)

  recentActivity.set(result)
}
