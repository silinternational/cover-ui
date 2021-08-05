<script>
import { Button } from '@silintl/ui-components'

// TODO: make this dependent on backend endpoint
const itemDetails = {
  "id": "7321f980-e1f0-42d3-b2b0-2e4704159f4f",
  "name": "IName-2",
  "category_id": "63bcf980-e1f0-42d3-b2b0-2e4704159f4f",
  "in_storage": false,
  "country": "ICountry2",
  "description": "This is the description for item 2.",
  "make": "IMAke-2",
  "model": "IModel-2",
  "serial_number": "ISN-2",
  "coverage_amount": 100,
  "purchase_date": "2021-07-30T16:05:27.361297Z",
  "coverage_status": "",
  "coverage_start_date": "0001-01-01T00:00:00Z",
  "created_at": "0001-01-01T00:00:00Z",
  "updated_at": "0001-01-01T00:00:00Z",
  "category": {
    "id": "63bcf980-e1f0-42d3-b2b0-2e4704159f4f",
    "risk_category_id": "3be38915-7092-44f2-90ef-26f48214b34f",
    "name": "ItemCat-2",
    "help_text": "This is help text for ItemCat-2",
    "status": "Enabled",
    "auto_approve_max": 200,
    "created_at": "2021-08-05T16:05:27.357297Z",
    "updated_at": "2021-08-05T16:05:27.357298Z"
  }
}
</script>

<h1>{itemDetails.name}</h1>
<h3>{itemDetails.description}</h3>