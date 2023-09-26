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

const categoryIcons: Record<string, string> = {
  computers: 'mdi:laptop',
  clothing: 'mdi:hanger',
  medical: 'mdi:wheelchair-accessibility',
  photography: 'mdi:camera',
  other: 'mdi:help-circle',
  musical: 'mdi:bugle',
  appliances: 'mdi:kettle',
  home: 'mdi:desk-lamp',
  electronics: 'mdi:satellite-uplink',
  books: 'mdi:album',
  travel: 'mdi:bicycle',
  vehicles: 'mdi:car',
}

export function getItemIcon(categoryKey: string): string {
  return categoryIcons[categoryKey] || 'mdi:help-circle'
}
