<script lang="ts">
import GooglePlacesAutocomplete from '@silintl/svelte-google-places-autocomplete'
import { createEventDispatcher } from 'svelte'

export let value = ''

const dispatch = createEventDispatcher<{ location_selected: string }>()
const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY
const options = {
  fields: ['address_components'],
  types: ['(regions)'],
}
const placeholder = 'Enter country'

const getCountryFrom = (placeChangeDetail) => {
  const addressComponents = placeChangeDetail?.place?.address_components || []
  const countryEntry = addressComponents.find((entry) => entry.types.includes('country'))
  if (countryEntry) {
    return countryEntry.long_name
  }
  return ''
}
const onPlaceChanged = (event) => {
  const country = getCountryFrom(event.detail)
  dispatch('location_selected', country)
}
</script>

{#if googlePlacesApiKey}
  <GooglePlacesAutocomplete
    apiKey={googlePlacesApiKey}
    {options}
    on:place_changed={onPlaceChanged}
    {placeholder}
    {value}
  />
{:else}
  (Please provide a GOOGLE_PLACES_API_KEY environment variable)
{/if}
