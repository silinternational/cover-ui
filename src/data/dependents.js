import { GET, CREATE, DELETE } from ".";
import user from "../authn/user"
import { writable } from "svelte/store";

export const dependents = writable([])
export const loading = writable(false)
export const initialized = writable(false)

export function init() {
  loadDependents()
}

/**
 *
 * @description a function to create a dependent for a certain policy
 * @export
 * @param {Object} depData
 * @return {Object} 
 */
export function addDependent(depData) {
    let policyId = user.policy_id
    loading.set(true)

    let parsedDep = {
      id: "3dfd1ee6-f6e0-11eb-9a03-0242ac130003",
      name: depData.name,
      relationship: depData.relationship,
      location: depData.location,
      child_birth_year: depData.childBirthYear
    }

    // TODO: uncomment when endpoint is finished
    // let dpndt = await CREATE(`/policies/${policyId}/dependets`, parsedDep)

    dependents.update(currDeps => {
      currDeps.push(parsedDep)
      return currDeps
    })

    loading.set(false)

    return parsedDep
} 

/**
 *
 * @description a function to delete a dependent
 * @export
 * @param {Number} depId
 * @return {null} 
 */
export async function deleteDependent(depId) {
    loading.set(true)

    // TODO: uncomment when endpoint is finished
    // await DELETE(`/dependents/${depId}`)

    dependents.update(currDeps => {
      return currDeps.filter(dep => dep.id !== depId)
    })

    loading.set(false)
    return null
}

/**
 *
 * @description a function to update a dependent 
 * @export
 * @param {Number} depId
 * @param {Object} depData
 */
export async function updateDependent(depId, depData) {
  loading.set(true)

  let parsedDep = {
    id: depId,
    name: depData.name,
    relationship: depData.relationship,
    location: depData.location,
    child_birth_year: depData.childBirthYear
  }

  // TODO: uncomment when endpoint is finished
  // let dpndt = await UPDATE(`/dependents/${depId}`)

  dependents.update(currDeps => {
    let i = currDeps.findIndex(dep => dep.id === depId)
    currDeps[i] = parsedDep
    return currDeps
  })

  loading.set(false)
}

/**
 *
 * @description a function to load the dependents of a policy
 * @export
 */
export async function loadDependents() {
  let policyId = user.policy_id
  loading.set(true)

  let dpndts = await GET(`/policies/${policyId}/dependents`)

  dependents.set(dpndts)

  loading.set(false)
  initialized.set(true)
}