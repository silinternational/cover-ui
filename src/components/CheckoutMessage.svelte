<script lang="ts">
import type { PolicyItem } from 'data/items'
import type { Policy } from 'data/policies'
import { getCheckoutMessage } from 'helpers/checkout'

export let item: PolicyItem | undefined = undefined
export let policy: Policy | undefined = undefined

$: householdId = policy?.household_id || ''
$: accountOrHouseholdId = householdId || policy?.account || ''
$: org = policy?.entity_code?.code

$: checkoutMessage = getCheckoutMessage(item, org, accountOrHouseholdId)
</script>

<div>
  {checkoutMessage}
</div>
