<script lang="ts">
import GooglePlacesAutocomplete from '@silintl/svelte-google-places-autocomplete'

export let value = ''

const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY
const options = {
  fields: ['address_components', 'geometry'],
  types: ['country'],
}
const placeholder = 'Enter country'
</script>

<label class="mdc-text-field mdc-text-field--outlined textfield-radius mdc-text-field--no-label">
  <GooglePlacesAutocomplete
    apiKey={googlePlacesApiKey}
    class="mdc-text-field__input"
    {options}
    on:place_changed
    {placeholder}
    on:ready
    {value}
  />
  <span class="mdc-notched-outline mdc-notched-outline--no-label">
    <span class="mdc-notched-outline__leading" /> <span class="mdc-notched-outline__trailing" />
  </span>
</label>
