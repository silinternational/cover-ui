import { DELETE, UPDATE } from "./index.js";
import { throwError } from "../error";
import { writable } from "svelte/store";

export const loading = writable(false)

/**
 *
 * @description a function to update an item
 * @export
 * @param {Object} item
 * @return {Object} 
 */
export async function updateItem(item) {
    if (!item.id) throwError("item id not set")
    
    loading.set(true)

    let itemId = item.id
    delete item.id
    // TODO: create `parsedItem` to validate item
    let item = await UPDATE(`/items/${itemId}`, item)

    loading.set(false)
    return item
}

/**
 *
 * @description a function to delete an item
 * @export
 * @param {Number} id
 * @return {null} 
 */
export async function deleteItem(id) {
    loading.set(true)

    await DELETE(`/items/${id}`)

    loading.set(false)
    return null
}