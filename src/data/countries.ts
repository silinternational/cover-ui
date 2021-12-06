import { GET } from '.'
import { readable } from 'svelte/store'

export type Country = {
  name: string
}

let hasLoaded = false

export const countries = readable<Country[]>([], function start(set) {
  if (!hasLoaded) {
    GET<Country[]>('config/countries').then((values: Country[]) => {
      set(values)
      hasLoaded = true
    })
  }
})
