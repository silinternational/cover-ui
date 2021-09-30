<script lang="ts">
import user from '../authn/user'
import { UserHomePage } from '../components'
import { loadClaims } from '../data/claims'
import { loadDependents } from '../data/dependents'
import { loadItems } from '../data/items'
import { loadMembersOfPolicy } from '../data/policy-members'

$: policyId = $user.policy_id
$: policyId && loadItems(policyId)
$: policyId && loadClaims()
$: policyId && loadDependents(policyId)
$: policyId && loadMembersOfPolicy(policyId)
</script>

<UserHomePage {policyId} />
