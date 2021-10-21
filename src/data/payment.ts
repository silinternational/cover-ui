import { writable } from 'svelte/store'

export const paymentReceivedByYearByPolicyId = writable<{ [policyId: string]: { [year: string]: boolean }[] }>({})
