<script lang="ts">
import { CUSTOMER_HOME } from 'helpers/routes'
import { redirect } from '@roxi/routify'

// TODO: Eventually redirect stewards and signators to their own home pages.
$redirect(CUSTOMER_HOME)
</script>
