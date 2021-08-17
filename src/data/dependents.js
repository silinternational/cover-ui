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
  start(policyId)
  
  let parsedDep = {
    name: depData.name,
    relationship: depData.relationship,
    location: depData.location,
    child_birth_year: depData.childBirthYear && parseInt(depData.childBirthYear)
  }
  
  const addedDependent = await CREATE(`policies/${policyId}/dependents`, parsedDep)
  
  dependentsByPolicyId.update(data => {
    const dependents = data[policyId] || []
    dependents.push(addedDependent)
    data[policyId] = dependents
    return data
  })
  
  stop(policyId)
  
  return addedDependent
}

/**
 *
 * @description a function to delete a dependent
 * @export
 * @param {string} dependentId -- The UUID for the desired dependent
 */
export async function deleteDependent(dependentId) {
  start(dependentId)
  
  // TODO: uncomment when endpoint is finished
  // await DELETE(`dependents/${depId}`)
  
  dependentsByPolicyId.update(data => {
    const dependents = data[policyId] || []
    data[policyId] = dependents.filter(dependent => dependent.id !== dependentId)
    return data
  })
  
  stop(dependentId)
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
  start(dependentId)
  
  let parsedDep = {
    id: dependentId,
    name: depData.name,
    relationship: depData.relationship,
    location: depData.location,
    child_birth_year: depData.childBirthYear
  }
  
  // TODO: uncomment when endpoint is finished
  // const updatedDependent = await UPDATE(`dependents/${dependentId}`)
  const updatedDependent = parsedDep // TEMP - until we can use API return value.
  
  dependentsByPolicyId.update(data => {
    const dependents = data[policyId] || []
    const i = dependents.findIndex(dependent => dependent.id === dependentId)
    dependents[i] = updatedDependent
    data[policyId] = dependents
    return data
  })
  
  stop(dependentId)
}

/**
 *
 * @description a function to load the dependents of a policy
 * @param {string} policyId -- The UUID for the desired policy
 * @export
 */
export async function loadDependents(policyId) {
  start(policyId)
  
  const loadedDependents = await GET(`policies/${policyId}/dependents`)
  dependentsByPolicyId.update(data => {
    data[policyId] = loadedDependents
    return data
  })
  
  stop(policyId)
}
