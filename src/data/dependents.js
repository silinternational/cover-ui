import { CREATE, GET } from "."
import { writable } from "svelte/store"
import { start, stop } from "../components/progress"

export const dependentsByPolicyId = writable({})

/**
 *
 * @description a function to create a dependent for a certain policy
 * @export
 * @param {string} policyId -- The UUID for the desired policy
 * @param {Object} depData
 * @return {Object}
 */
export async function addDependent(policyId, depData) {
  const urlPath = `policies/${policyId}/dependents`
  start(urlPath)
  
  let parsedDep = {
    name: depData.name,
    relationship: depData.relationship,
    location: depData.location,
    child_birth_year: depData.childBirthYear && parseInt(depData.childBirthYear)
  }
  
  const addedDependent = await CREATE(urlPath, parsedDep)
  
  dependentsByPolicyId.update(data => {
    const dependents = data[policyId] || []
    dependents.push(addedDependent)
    data[policyId] = dependents
    return data
  })
  
  stop(urlPath)
  
  return addedDependent
}

/**
 *
 * @description a function to delete a dependent
 * @export
 * @param {string} dependentId -- The UUID for the desired dependent
 */
export async function deleteDependent(dependentId) {
  const urlPath = `dependents/${dependentId}`
  start(urlPath)
  
  // TODO: uncomment when endpoint is finished
  // await DELETE(urlPath)
  
  dependentsByPolicyId.update(data => {
    const dependents = data[policyId] || []
    data[policyId] = dependents.filter(dependent => dependent.id !== dependentId)
    return data
  })
  
  stop(urlPath)
}

/**
 *
 * @description a function to update a dependent
 * @export
 * @param {string} policyId -- The UUID for the applicable policy
 * @param {string} dependentId -- The UUID for the desired dependent
 * @param {Object} depData
 */
export async function updateDependent(policyId, dependentId, depData) {
  const urlPath = `dependents/${dependentId}`
  start(urlPath)
  
  let parsedDep = {
    id: dependentId,
    name: depData.name,
    relationship: depData.relationship,
    location: depData.location,
    child_birth_year: depData.childBirthYear
  }
  
  // TODO: uncomment when endpoint is finished
  // const updatedDependent = await UPDATE(urlPath)
  const updatedDependent = parsedDep // TEMP - until we can use API return value.
  
  dependentsByPolicyId.update(data => {
    const dependents = data[policyId] || []
    const i = dependents.findIndex(dependent => dependent.id === dependentId)
    dependents[i] = updatedDependent
    data[policyId] = dependents
    return data
  })
  
  stop(urlPath)
}

/**
 *
 * @description a function to load the dependents of a policy
 * @param {string} policyId -- The UUID for the desired policy
 * @export
 */
export async function loadDependents(policyId) {
  const urlPath = `policies/${policyId}/dependents`
  start(urlPath)
  
  const loadedDependents = await GET(urlPath)
  dependentsByPolicyId.update(data => {
    data[policyId] = loadedDependents
    return data
  })
  
  stop(urlPath)
}
