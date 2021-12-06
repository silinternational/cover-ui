import { writable } from 'svelte/store'

export type PolicyItemHistory = {
  id: string
  policy_id: string
  user_id: string
  action: string
  item_id: string
  old_value: string
  new_value: string
  field_name: string
  created_at: string /* Date */
  updated_at: string /* Date */
}

export const policyHistoryByItemId = writable<{ [policyItemId: string]: PolicyItemHistory[] }>({})

export async function loadPolicyItemHistory(policyId: string, policyItemId: string): Promise<void> {
  // TODO: Retrieve list of policy_histories from BE
  let historyRecords: PolicyItemHistory[] = [
    {
      id: '8d00b398-0308-4cfc-a524-14855d9c9042',
      policy_id: policyId,
      user_id: 'USER_ID',
      action: 'Update',
      item_id: policyItemId,
      old_value: 'Draft',
      new_value: 'Pending',
      field_name: 'CoverageStatus',
      created_at: '2021-10-21 13:48:48.921484',
      updated_at: '2021-10-21 13:48:48.921494',
    },
    {
      id: '38f922d3-35df-495f-9d62-8905150ef1a0',
      policy_id: policyId,
      user_id: 'STEWARD_ID',
      action: 'Update',
      item_id: policyItemId,
      old_value: 'Pending',
      new_value: 'Approved',
      field_name: 'CoverageStatus',
      created_at: '2021-10-21 13:48:58.177954',
      updated_at: '2021-10-21 13:48:58.177963',
    },
  ]

  policyHistoryByItemId.update((data) => {
    data[policyItemId] = historyRecords
    return data
  })
}
