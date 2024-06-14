import { ItemCoverageStatus, type PolicyItem } from 'data/types/items'

export function hasEnded(item: PolicyItem): boolean {
  return item.coverage_status === ItemCoverageStatus.Inactive && !!item.coverage_end_date
}

export function willEnd(item: PolicyItem): boolean {
  return item.coverage_status === ItemCoverageStatus.Approved && !!item.coverage_end_date
}

export function noCoverage(status: ItemCoverageStatus): boolean {
  return status === ItemCoverageStatus.Inactive || status === ItemCoverageStatus.Denied
}

const categoryIcons: Record<string, string> = {
  appliances: 'mdi:kettle',
  books: 'mdi:album',
  cars: 'mdi:car',
  clothing: 'mdi:hanger',
  computers: 'mdi:laptop',
  electronics: 'mdi:satellite-uplink',
  home: 'mdi:desk-lamp',
  medical: 'mdi:wheelchair-accessibility',
  musical: 'mdi:bugle',
  other: 'mdi:help-circle',
  photography: 'mdi:camera',
  travel: 'mdi:bicycle',
}

export function getItemIcon(categoryKey: string): string {
  return categoryIcons[categoryKey] || 'mdi:help-circle'
}
