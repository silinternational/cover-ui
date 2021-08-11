import { CREATE, GET } from "."
import user from "../authn/user"
import { writable } from "svelte/store"
import { start, stop } from "../components/progress"

export const dependents = writable([])
export const initialized = writable(false)

/**
 *
 * @description a function to create a dependent for a certain policy
 * @export
 * @param {string} policyId
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
 * @param {Number} depId
 * @return {null} 
 */
export async function deleteDependent(depId) {
    start(depId)

    // TODO: uncomment when endpoint is finished
    // await DELETE(`dependents/${depId}`)

    dependents.update(currDeps => {
      return currDeps.filter(dep => dep.id !== depId)
    })

    stop(depId)
}

/**
 *
 * @description a function to update a dependent 
 * @export
 * @param {Number} depId
 * @param {Object} depData
 */
export async function updateDependent(depId, depData) {
  start(depId)

  let parsedDep = {
    id: depId,
    name: depData.name,
    relationship: depData.relationship,
    location: depData.location,
    child_birth_year: depData.childBirthYear
  }

  // TODO: uncomment when endpoint is finished
  // let dpndt = await UPDATE(`dependents/${depId}`)

  dependents.update(currDeps => {
    let i = currDeps.findIndex(dep => dep.id === depId)
    currDeps[i] = parsedDep
    return currDeps
  })

  stop(depId)
}

/**
 *
 * @description a function to load the dependents of a policy
 * @param {string} policyId
 * @export
 */
export async function loadDependents(policyId) {
  start(policyId)

  let dpndts = await GET(`policies/${policyId}/dependents`)

  dependents.set(dpndts)

  stop(policyId)
  initialized.set(true)
}