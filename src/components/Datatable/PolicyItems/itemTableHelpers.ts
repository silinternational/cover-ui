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
    case 'Appliances and home electronics':
      return 'mdi:kettle'
    case 'Clothing':
      return 'mdi:hanger'
    case 'Computers and accessories':
      return 'mdi:laptop'
    case 'Bikes and Lightweight Vehicles':
      return 'mdi:scooter'
    case 'Field electronics':
      return 'mdi:satellite-uplink'
    case 'Furniture':
      return 'mdi:table-chair'
    case 'Home goods':
      return 'mdi:desk-lamp'
    case 'Medical':
      return 'mdi:wheelchair-accessibility'
    case 'Mobile phones':
      return 'mdi:cellphone'
    case 'Musical instruments':
      return 'mdi:bugle'
    case 'Photography and videography':
      return 'mdi:camera'
    case 'Vehicles':
      return 'mdi:car'
    default:
      return 'mdi:help-circle'
  }
}
