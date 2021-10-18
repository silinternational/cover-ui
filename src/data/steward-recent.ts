import { GET } from '.'
import type { Claim } from './claims'
import type { PolicyItem } from './items'
import { writable } from 'svelte/store'

export type RecentClaim = {
  Claim: Claim
  StatusUpdatedAt: string /* Date */
}

export type RecentItem = {
  Item: PolicyItem
  StatusUpdatedAt: string /* Date */
}

type RecentChange = RecentClaim | RecentItem

export type RecentActivity = {
  Claims: RecentClaim[]
  Items: RecentItem[]
}

export const recentChanges = writable<RecentChange[]>([])

/**
 * Load the list of recent activity.
 *
 * @export
 */
export async function loadRecentActivityForSteward(): Promise<void> {
  const urlPath = 'steward/recent'
  const recentActivity = await GET<RecentActivity>(urlPath)
  const recentClaims = recentActivity.Claims
  const recentItems = recentActivity.Items
  const mergedRecentObjects = [...recentClaims, ...recentItems]
  mergedRecentObjects.sort((a: RecentChange, b: RecentChange) => {
    const dateA = new Date(a.StatusUpdatedAt)
    const dateB = new Date(b.StatusUpdatedAt)
    return dateB - dateA
  })
  recentChanges.set(mergedRecentObjects)
}
