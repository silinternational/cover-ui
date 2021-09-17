<script lang="ts">
import { Breadcrumb } from '../components'
import { Button, Page } from '@silintl/ui-components'
import { goto } from '@roxi/routify'

</script>

<Page>
    <Breadcrumb />
    <p>
        <Button outlined url='/settings/personal'>Personal Settings</Button>
    </p>
    <p>
        <Button outlined url='/settings/household'>Household Settings</Button>
    </p>
</Page>