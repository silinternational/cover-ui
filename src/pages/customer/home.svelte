<script lang="ts">
import { policyHome } from 'helpers/routes'
import { goto } from '@roxi/routify'
import { selectedPolicyId } from 'data/role-policy-selection'

/* TODO: Load customer's corporate policies (if any) and intelligently decide
 * which policy to default to. */
$: $goto(policyHome($selectedPolicyId))
</script>
