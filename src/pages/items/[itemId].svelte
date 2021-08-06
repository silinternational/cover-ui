<script>
import user from '../../authn/user.js'
import { getItems } from '../../data/items.js'
import { Banner, Breadcrumb } from '../../components'
import { Button } from '@silintl/ui-components'
import { goto, params } from '@roxi/routify'

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
const breadcrumbLinks = [
  {
    name: "Items",
    url: "/items",
  },
  // TODO: make this fetch the name of the item and have that as the name 
  {
    name: "This Item",
    url: `/items/${$params.itemId}`
  },
]

let items
let item
getItems(user.policy_id).then(loadedItems => items = loadedItems)

$: items && (item = items.find(itm => itm.id === $params.itemId))

const goToEditItem = () => {
  $goto(`/items/${$params.itemId}/edit`)
}
const goToNewClaim = () => {
  $goto(`/items/${$params.itemId}/new-claim`)
}
const goToDelete = () => {
  $goto(`/items/${$params.itemId}/delete`)
}
</script>

<style>
.delete-button {
  color: var(--mdc-theme-status-error);
  text-decoration: none;
  margin: 5px;
}

p {
  font-weight: 600;
}
</style>

{#if items && !item } 
  Item does not exist!
{:else if items }
  <Breadcrumb links={breadcrumbLinks} />
  <h1>{itemDetails.name}</h1>
  <h3>{itemDetails.make} {itemDetails.model}</h3>
  <Banner background="var(--mdc-theme-neutral">{itemDetails.category.name}</Banner>
  <p>Market value: ${itemDetails.coverage_amount}</p>
  <!--TODO: get this from backend when available-->
  <p>Annual premium: ${16.20}</p>
  <p>Description: {itemDetails.description}</p>
  <!--TODO: get this from backend when available-->
  <p>Accountable person: {"Jeff Smith"}</p>
  <p>Unique identifier: {itemDetails.serial_number}</p>
  <p>Coverage added: {new Date(itemDetails.coverage_start_date).toDateString()}</p>
  <p>Coverage ends: {"13 December 2029"}</p>
  <div>
    <Button on:click={goToEditItem} raised>Edit Details</Button>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a on:click={goToDelete} class="delete-button" href="">Remove Coverage</a>
  </div>
  <br />
  <div>
    <Button class="mdc-theme--secondary-background" on:click={goToNewClaim} raised>File Claim</Button>
  </div>
{/if}