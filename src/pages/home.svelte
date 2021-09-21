<script lang="ts">
import user from '../authn/user'
import { Menu, ClaimCards, Row } from '../components/'
import { isLoadingById } from '../components/progress/index'
import { claims, loadClaims } from '../data/claims'
import { itemsByPolicyId, loadItems } from '../data/items'
import { loadPolicies } from '../data/policies'
import { formatMoney } from '../helpers/money'
import { goto } from '@roxi/routify'
import { Checkbox, Page, Datatable } from '@silintl/ui-components'
import { onMount } from 'svelte'

const menuItems = id => [
  {
    label: 'View Details', url: `/items/${id}`
  },
  {
    label: 'Edit', url: `/items/${id}/edit`
  },
  {
    label: 'Remove Coverage', url: `/items/${id}/remove-coverage`
  }
]

let selected = []
let goToItemDetails = true
let shownMenus = {}

$: $user.policy_id && loadItems($user.policy_id)
$: items = $itemsByPolicyId[$user.policy_id] || []

onMount( () => {
  loadClaims()

  loadPolicies()
})

const redirect = url => {
  if (goToItemDetails) {
    $goto(url)
  } else {
    goToItemDetails = true
  }
}
const handleChecked = id => {
  selected.push(id)
}
const handleUnchecked = id => {
  selected = selected.filter(val => val != id)
}
const handleMoreVertClick = id => {
  goToItemDetails = false
  shownMenus[id] = shownMenus[id] !== true
}
const onEditClaim = event => {
  const claimId = event.detail
  $goto(`/claims/${claimId}/edit`)
}
</script>

<style>
/* TODO: make this more accurate when design is finialized */

.home-table-more-vert {
  width: 30px;
  height: 30px;
  margin-top: 12px;
  color: #858C94;
  cursor: pointer;
}

.home-table-more-vert:hover {
  color: #6e7377;
}

.item-menu {
  position: absolute;
  right: 235px;
}
</style>

<Page loading={isLoadingById($user.policy_id)} layout="grid">   
  <Row cols={'12'}>
    <ClaimCards claims={$claims} {items} on:edit-claim={onEditClaim} />
  </Row>

  <Row cols={'12'}>
    {#if isLoadingById($user.policy_id) }
      Loading items...
    {:else}
      <Datatable>
        <Datatable.Header>
          <!--TODO: make the amount of columns shown be dependent on the device size-->
          <Datatable.Header.Item></Datatable.Header.Item>
          <Datatable.Header.Item>Item</Datatable.Header.Item>
          <Datatable.Header.Item>Recent Activity</Datatable.Header.Item>
          <Datatable.Header.Item>Accountable Person</Datatable.Header.Item>
          <Datatable.Header.Item>Cost</Datatable.Header.Item>
          <Datatable.Header.Item>Premium</Datatable.Header.Item>
          <Datatable.Header.Item>Type</Datatable.Header.Item>
        </Datatable.Header>
        <Datatable.Data>
          {#each items as item (item.id)}
              <Datatable.Data.Row on:click={() => redirect(`/items/${item.id}`)} clickable>
                <Datatable.Data.Row.Item>
                  <div on:click={() => goToItemDetails = false}>
                    <Checkbox on:checked={() => handleChecked(item.id)} on:unchecked={() => handleUnchecked(item.id)}/>
                  </div>
                </Datatable.Data.Row.Item>
                <Datatable.Data.Row.Item>{item.name || ''}</Datatable.Data.Row.Item>
                <Datatable.Data.Row.Item>{item.coverage_status || ''}</Datatable.Data.Row.Item>
                <Datatable.Data.Row.Item>{item.accountable_person || ''}</Datatable.Data.Row.Item>
                <Datatable.Data.Row.Item>{formatMoney(item.coverage_amount)}</Datatable.Data.Row.Item>
                <Datatable.Data.Row.Item>{formatMoney(item.annual_premium)}</Datatable.Data.Row.Item>
                <Datatable.Data.Row.Item>{item.risk_category?.name || ''}</Datatable.Data.Row.Item>
                <Datatable.Data.Row.Item>
                  <svg class="home-table-more-vert" viewBox="0 0 30 30" on:click={() => handleMoreVertClick(item.id)}>
                    <path fill="currentColor" d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
                  </svg>
                  <!--TODO FUTURE: make this show above the more vert icon when it is in the lower half of the page-->
                  <div class="item-menu"><Menu bind:menuOpen={shownMenus[item.id]} menuItems="{menuItems(item.id)}" on:syncToggler={() => shownMenus[item.id] = false}/></div>
                </Datatable.Data.Row.Item>
              </Datatable.Data.Row>
          {/each}
        </Datatable.Data>
      </Datatable>
    {/if}
    </Row>
</Page>
