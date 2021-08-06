
<script>
import { Datatable } from '../components/'
import { Checkbox, Page } from '@silintl/ui-components'
import ClaimCard from '../components/ClaimCard.svelte';

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

let selected = []
let loading = false
let shownMenu

const handleChecked = id => {
  selected.push(id)
  console.log(selected)
}
const handleUnchecked = id => {
  selected = selected.filter(val => val != id)
  console.log(selected)
}
const handleMoreVertClick = id => {
  if (shownMenu == id) {
    shownMenu = null
  } else {
    shownMenu = id
  }
}

</script>

<style>
/* TODO: make this more accurate when design is finialized */
.grid {
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-gap: 10px;
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

.home-floating-menu {
  position: absolute;
  background: white;
  box-shadow: 0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12),0px 5px 5px -3px rgba(0,0,0,0.2);
  padding: 20px;
  left: 88%;
  margin-top: 45px;
  border-radius: 3px;
}

.shown {
  display: inherit;
}

.not-shown {
  display: none;
}
</style>

<Page layout="grid">   
  <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-1"/>
  <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-10">
    <div class="grid">
      {#each exampleItems as item}
        <ClaimCard {item} buttons={[ { label: "Edit coverage", url: "/items/edit-coverage" } ]} />
      {/each}
    </div>
  </div>
  <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-1"/>

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
            <Datatable.Data.Row>
              <Datatable.Data.Row.Item><Checkbox on:checked={() => handleChecked(item.id)} on:unchecked={() => handleUnchecked(item.id)}/></Datatable.Data.Row.Item>
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
              </Datatable.Data.Row.Item>
              <!--TODO FUTURE: make it so that when you lose focus on this menu, it closes-->
              <div class="home-floating-menu {shownMenu == item.id ? "shown" : "not-shown"}">
                hey there
              </div>
            </Datatable.Data.Row>
          {/each}
        </Datatable.Data>
      </Datatable>
    {/if}
  </div>
</Page>