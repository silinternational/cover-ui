<script lang="ts">
import type { PolicyItem } from 'data/items'
import { getCheckoutMessage } from 'helpers/checkout'

export let accountOrHouseholdId = ''
export let item: PolicyItem | undefined = undefined
export let org = ''

$: checkoutMessage = getCheckoutMessage(item, org, accountOrHouseholdId)
</script>

<div>
  {checkoutMessage}
</div>
