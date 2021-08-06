
<script>
import { Datatable, Menu } from '../components/'
import ClaimCard from '../components/ClaimCard.svelte'
import { Checkbox, isAboveMobile, isAboveTablet, Page } from '@silintl/ui-components'
import { goto } from '@roxi/routify'
import { onMount } from 'svelte'

// TODO: update this to be dependent on backend endpoint
const examplePolicies = [
  {
    id: 1234,
    item_name: "Laptop",
    recent_activity: "Awaiting approval",
    accountable_person: "Bob Smith",
    cost: 943,
    premium: 18.86,
    type: "Mobile",
  },
  {
    id: 5678,
    item_name: "Saxophone",
    recent_activity: "Added a month ago",
    accountable_person: "Mary Smith",
    cost: 54,
    premium: 1.08,
    type: "Mobile",
  },
  {
    id: 9101,
    item_name: "Couch",
    recent_activity: "Removed last week",
    accountable_person: "Jim Smith",
    cost: 943,
    premium: 18.86,
    type: "Stationary",
  }
]
const exampleItems = [
  {
    name: "Saxophone",
    accountable_person: "John Russel",
    last_changed: "5 days",
  },
  {
    name: "GoPro",
    accountable_person: "Priscilla Russel",
    last_changed: "5 days"
  },
  {
    name: "GoPro",
    accountable_person: "Priscilla Russel",
    last_changed: "5 days"
  },
  {
    name: "GoPro",
    accountable_person: "Priscilla Russel",
    last_changed: "5 days"
  },
  {
    name: "GoPro",
    accountable_person: "Priscilla Russel",
    last_changed: "5 days"
  },
  {
    name: "GoPro",
    accountable_person: "Priscilla Russel",
    last_changed: "5 days"
  },
]
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
let loading = false
let otherClick = false
let shownMenus = {}
let gridCols = ''

onMount(() => {
  setCardCols()
})

const redirect = (url) => {
  if (!otherClick) {
    $goto(url)
  } else {
    otherClick = false
  }
}
const handleChecked = id => {
  selected.push(id)
}
const handleUnchecked = id => {
  selected = selected.filter(val => val != id)
}
const handleMoreVertClick = id => {
  otherClick = true
  shownMenus[id] = shownMenus[id] !== true
}
const setCardCols = () => {
  if ( isAboveTablet() ) {
    gridCols = 'cols-lg'
  } else if ( isAboveMobile() ) {
    gridCols = 'cols-md'
  } else {
    gridCols = 'cols-sm'
  }
}

</script>

<style>
/* TODO: make this more accurate when design is finialized */
.grid {
  display: grid;
  grid-gap: 8px;
}

.cols-lg {
  grid-template-columns: minmax(220px, 330px) minmax(220px, 330px) minmax(220px, 330px);
}

.cols-md {
  grid-template-columns: minmax(220px, 330px) minmax(220px, 330px);
}

.cols-sm {
  grid-template-columns: minmax(220px, 330px);
}

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

<svelte:window on:resize={setCardCols}/>

<Page layout="grid">   
  <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
    <div class="flex justify-center">
      <div class="grid {gridCols}">
        {#each exampleItems as item}
          <ClaimCard {item} buttons={[ { label: "Edit coverage", url: "/items/edit-coverage" } ]} />
        {/each}
      </div>
    </div>
  </div>

  <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
    <!--TODO: add an '$' before the 'loading' when it because a store-->
    {#if loading }
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
          {#each examplePolicies as item}
              <Datatable.Data.Row on:click={() => redirect(`/items/${item.id}`)} redirect>
                <Datatable.Data.Row.Item>
                  <div on:click={() => otherClick = true}>
                    <Checkbox on:checked={() => handleChecked(item.id)} on:unchecked={() => handleUnchecked(item.id)}/>
                  </div>
                </Datatable.Data.Row.Item>
                <Datatable.Data.Row.Item>{item.item_name}</Datatable.Data.Row.Item>
                <Datatable.Data.Row.Item>{item.recent_activity}</Datatable.Data.Row.Item>
                <Datatable.Data.Row.Item>{item.accountable_person}</Datatable.Data.Row.Item>
                <Datatable.Data.Row.Item>${item.cost}</Datatable.Data.Row.Item>
                <Datatable.Data.Row.Item>${item.premium}</Datatable.Data.Row.Item>
                <Datatable.Data.Row.Item>{item.type}</Datatable.Data.Row.Item>
                <Datatable.Data.Row.Item>
                  <svg class="home-table-more-vert" viewBox="0 0 30 30" on:click={() => handleMoreVertClick(item.id)}>
                    <path fill="currentColor" d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
                  </svg>
                  <!--TODO FUTURE: make this show above the more vert icon when it is in the lower half of the page-->
                  <div class="item-menu"><Menu bind:menuToggler={shownMenus[item.id]} menuItems="{menuItems(item.id)}" on:syncToggler={() => shownMenus[item.id] = false}/></div>
                </Datatable.Data.Row.Item>
              </Datatable.Data.Row>
          {/each}
        </Datatable.Data>
      </Datatable>
    {/if}
  </div>
</Page>