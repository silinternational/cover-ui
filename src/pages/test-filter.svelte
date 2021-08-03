<script>
import FilteredList from '../components/filteredList/index.js'
import Table from '../components/table/index.js'

let changingValue

let items = [
  {
    name: "test thing 1",
    id: 1234,
    email: "asdf@gmail.com",
    phone: "999-999-9999"
  },
  {
    name: "123test thing 2",
    id: 5678,
    email: "testing123@test.com",
    phone: "none"
  }
]

let filter =  new FilteredList.Filter(changingValue)
filter.setFilterFunc(item => {
  return !filter.filterValue || item.name.startsWith(filter.filterValue)
})

let filters = [
  filter
]

// setTimeout(() => {
//   changingValue = "test thing 1"
//   filters = FilteredList.updateFilterValue(filters, filter, changingValue)
// }, 2000)
</script>

<FilteredList filters="{filters}" items="{items}" let:items={filteredItems}>
  <textarea on:change="{value => {FilteredList.updateFilterValue(filters, filter, value.target.value); console.log(value.target.value)}}" />
  <Table headers="{["Name", "Id", "Email", "Phone"]}">
    {#each filteredItems as { name, id, email, phone }}
      <Table.Row values="{[name, id, email, phone]}" />
    {/each}
  </Table>
</FilteredList>