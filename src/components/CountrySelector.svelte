<script lang="ts">
import { countries, Country } from 'data/countries'
import { SearchableSelect, setNotice } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let country = ''
export let required = false

let countryOptions: any = {}

$: $countries.forEach((country: Country) => (countryOptions[country.name] = country.name))

const dispatch = createEventDispatcher()

const isCountryValid = (countryName: string) => $countries.some((country) => country.name === countryName)

const updateCountry = (event: CustomEvent) => {
  if (isCountryValid(event.detail)) {
    country = event.detail
    dispatch('chosen', country)
  } else if (country === '') {
    setNotice('Please select a country from the list')
  }
}
</script>

<SearchableSelect
  {required}
  choice={country}
  options={countryOptions}
  placeholder="Enter country"
  on:check={updateCountry}
/>
