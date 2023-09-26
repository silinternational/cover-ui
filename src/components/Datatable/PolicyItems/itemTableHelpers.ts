import type { itemCategoryName } from 'data/itemCategories'
import { ItemCoverageStatus, type PolicyItem } from 'data/items'

export function hasEnded(item: PolicyItem): boolean {
  return item.coverage_status === ItemCoverageStatus.Inactive && !!item.coverage_end_date
}

export function willEnd(item: PolicyItem): boolean {
  return item.coverage_status === ItemCoverageStatus.Approved && !!item.coverage_end_date
}

export function noCoverage(status: ItemCoverageStatus): boolean {
  return status === ItemCoverageStatus.Inactive || status === ItemCoverageStatus.Denied
}

export function getItemIcon(categoryName: itemCategoryName): string {
  switch (categoryName) {
    case 'Computers, tablets, and phones':
      return 'mdi:laptop'
    case 'Clothing':
      return 'mdi:hanger'
    case 'Medical':
      return 'mdi:wheelchair-accessibility'
    case 'Photography and recording':
      return 'mdi:camera'
    case 'Other':
      return 'mdi:help-circle'
    case 'Musical instruments':
      return 'mdi:bugle'
    case 'Appliances and home electronics':
      return 'mdi:kettle'
    case 'Home goods':
      return 'mdi:desk-lamp'
    case 'Field site electronics':
      return 'mdi:satellite-uplink'
    case 'Books and media':
      return 'mdi:album'
    case 'Travel and recreation':
      return 'mdi:bicycle'
    case 'Vehicles':
      return 'mdi:car'
    default:
      return 'mdi:help-circle'
  }
}
