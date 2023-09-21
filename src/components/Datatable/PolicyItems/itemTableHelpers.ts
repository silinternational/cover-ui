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

export function getItemIcon(categoryId: string): string {
  switch (categoryId) {
    case 'd4632d64-67b5-4795-a7de-66b95312fa7e': //computers, tablets, phones
      return 'mdi:laptop'
    case '9c682e38-78fd-475b-9810-3a7f2e9f1fe4': //clothing
      return 'mdi:hanger'
    case '4b06f087-3fb0-4345-82e8-803645962db0': //medical
      return 'mdi:wheelchair-accessibility'
    case '61081c4d-b6e3-47c5-aca7-373fa7d30896': //photography and recording
      return 'mdi:camera'
    case '863a3306-78f9-4aca-add5-0abda3a1ef02': //other
      return 'mdi:help-circle'
    case 'faa39da0-981e-4fcf-92fc-2c047fd21f15': //musical instruments
      return 'mdi:bugle'
    case '660629ef-ff63-4ace-8263-993897de7d6b': //appliances and home electronics
      return 'mdi:kettle'
    case 'aa304ce5-be3d-45eb-929e-b4575973c0d3': //home goods
      return 'mdi:desk-lamp'
    case '722c03e5-7852-44b9-b86a-af5d63b39d0e': //field site electronics
      return 'mdi:satellite-uplink'
    case '0f7aa101-bfdb-4a19-a182-c5ff1d16f6b2': //books
      return 'mdi:book'
    case '036e5315-18ca-4404-8435-72a695f2c9a7': //travel and recreation
      return 'mdi:travel'
    case '0619a0ba-785e-428d-858c-96d3bd56929a': //cars and heavy vehicles
      return 'mdi:car'
    default:
      return 'mdi:help-circle'
  }
}
