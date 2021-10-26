<script lang="ts">
import { items as itemsRoute } from 'helpers/routes'
import { goto } from '@roxi/routify'

export let policyId: string

$: policyId && $goto(itemsRoute(policyId))
</script>
