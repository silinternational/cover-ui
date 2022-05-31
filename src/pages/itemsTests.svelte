<script>
import { testLoadItems } from '../../tests/itemsTests'
import { onMount } from 'svelte'

let passed
onMount(async () => {
  passed = await testLoadItems()
})
</script>

passed?
{passed}
