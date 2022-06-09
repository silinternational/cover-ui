import { itemsByPolicyId, loadItems } from '../src/data/items'
import user, { loadUser } from '../src/data/user'
import { get, Writable } from 'svelte/store'

const objectIsCorrectShape = (obj: any, propertyNames: string[]): boolean => {
  const objectKeys = Object.keys(obj)
  return propertyNames.every((prop) => objectKeys.includes(prop))
}
// test loading items from a policy
export async function testLoadItems(): Promise<boolean> {
  const expectedProperties = ['accountable_person', 'coverage_start_date', 'id', 'annual_premium', 'category']
  console.log('expected properties: ', expectedProperties)
  await loadUser()
  const policyId = get(user).policies[0].id
  itemsByPolicyId.set({})
  console.log('items set to {}:', get(itemsByPolicyId))
  await loadItems(policyId)
  console.log('items after calling function:', get(itemsByPolicyId))
  const itemEntries = Object.entries(get(itemsByPolicyId))
  const passed = itemEntries.every((entry) => {
    const items = entry[1]
    return items.every((item) => objectIsCorrectShape(item, expectedProperties))
  })
  console.log('passed: ', passed)
  return passed
}

// test any function
export async function testFunctionThatGetsArray(
  functionToTest,
  storeOfthingLoaded: Writable<[]>,
  expectedProperties: string[],
  ...parameters
): Promise<boolean> {
  console.log('expected properties: ', expectedProperties)
  await functionToTest(parameters)
  const policyId = get(user).policies[0].id
  storeOfthingLoaded.set([])
  console.log('things set to []:', get(storeOfthingLoaded))
  await functionToTest(policyId)
  console.log('things after calling function:', get(storeOfthingLoaded))
  const passed = get(storeOfthingLoaded).every((e) => objectIsCorrectShape(e, expectedProperties))
  console.log('passed: ', passed)
  return passed
}