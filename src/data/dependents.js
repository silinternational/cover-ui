import { CREATE, GET } from "."
import { writable } from "svelte/store"
import { start, stop } from "../components/progress"

export const dependents = writable([])
export const initialized = writable(false)

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

    let dpndt = await CREATE(`policies/${policyId}/dependents`, parsedDep)

    dependents.update(currDeps => {
      currDeps.push(parsedDep)
      return currDeps
    })

    stop(policyId)

    return parsedDep
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

    dependents.update(currDeps => {
      return currDeps.filter(dep => dep.id !== dependentId)
    })

    stop(dependentId)
}

/**
 *
 * @description a function to update a dependent 
 * @export
 * @param {string} dependentId -- The UUID for the desired dependent
 * @param {Object} depData
 */
export async function updateDependent(dependentId, depData) {
  start(dependentId)

  let parsedDep = {
    id: dependentId,
    name: depData.name,
    relationship: depData.relationship,
    location: depData.location,
    child_birth_year: depData.childBirthYear
  }

  // TODO: uncomment when endpoint is finished
  // let dpndt = await UPDATE(`dependents/${dependentId}`)

  dependents.update(currDeps => {
    let i = currDeps.findIndex(dep => dep.id === dependentId)
    currDeps[i] = parsedDep
    return currDeps
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

  let dpndts = await GET(`policies/${policyId}/dependents`)

  dependents.set(dpndts)

  stop(policyId)
  initialized.set(true)
}
