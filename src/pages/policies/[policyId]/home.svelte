<script lang="ts">
import { items as itemsRoute } from 'helpers/routes'
import { redirect } from '@roxi/routify'

export let policyId: string

$: policyId && $redirect(itemsRoute(policyId))
</script>
