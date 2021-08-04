<script>
import Datatable from '../components/tempDatatable'
import { Card, Checkbox, CustomCard } from '@silintl/ui-components'

// TODO: update this to be dependent on backend endpoint
let selected = []
let loading = false
let exampleItems = [
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

const handleChecked = id => {
  selected.push(id)
  console.log(selected)
}

const handleUnchecked = id => {
  selected = selected.filter(val => val != id)
  console.log(selected)
}
const rowCheckboxList = () => {

}

</script>

<style>
  /* TODO: make this more accurate when design is finialized */
  .home-page-content {
    margin: 30px 5px;
  }

  .card-header {
    margin: 10px;
    color: #FFEB98;
  }

  .home-todo-list {
    margin: 20px 0;
  }

  .home-table {
    margin: 20px 0;
  }
</style>

<div class="home-page-content">
  <Card color="#103066">
    <h2 class="card-header">To-Dos</h2>
  </Card>
  <!--TODO: make this a grid (I think) when design is finialized-->
  <div style="display: flex">
    <CustomCard title="Title" footerText="Footer Text" buttons="{[ { label: "Primary Button", url: "/idk-where-to-go" } ]}">
      Accountable Person
    </CustomCard>
    <CustomCard title="Title" footerText="Footer Text" buttons="{[ { label: "Primary Button", url: "/idk-where-to-go" } ]}">
      Accountable Person
    </CustomCard>
  </div>
  <div class="home-todo-list">
    <Card></Card>
  </div>
  <Card color="#103066">
    <h2 class="card-header">Covered Items</h2>
  </Card>
  <div class="home-table">
    <!--TODO: add an '$' before the 'loading' when it because a store-->
    {#if loading }
      Loading items...
    {:else}
      <Datatable>
        <Datatable.Header>
          <!--TODO: make the amount of columns shown be dependent on the device size-->
          <Datatable.Header.Item></Datatable.Header.Item>
          <Datatable.Header.Item><strong>Item</strong></Datatable.Header.Item>
          <Datatable.Header.Item><strong>Recent Activity</strong></Datatable.Header.Item>
          <Datatable.Header.Item><strong>Accountable Person</strong></Datatable.Header.Item>
          <Datatable.Header.Item><strong>Cost</strong></Datatable.Header.Item>
          <Datatable.Header.Item><strong>Premium</strong></Datatable.Header.Item>
          <Datatable.Header.Item><strong>Type</strong></Datatable.Header.Item>
        </Datatable.Header>
    
        <Datatable.Data>
          {#each exampleItems as item}
            <Datatable.Data.Row>
              <!--TODO: fix `_this.rowCheckboxList is undefined` error with Checkbox-->
              <Datatable.Data.Row.Item><Checkbox on:checked={() => handleChecked(item.id)} on:unchecked={() => handleUnchecked(item.id)}/></Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>{item.item_name}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>{item.recent_activity}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>{item.accountable_person}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>${item.cost}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>${item.premium}</Datatable.Data.Row.Item>
              <Datatable.Data.Row.Item>{item.type}</Datatable.Data.Row.Item>
            </Datatable.Data.Row>
          {/each}
        </Datatable.Data>
      </Datatable>
    {/if}
  </div>
</div>