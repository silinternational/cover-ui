<script lang="ts">
import { Breadcrumb } from 'components'
import { SETTINGS_PERSONAL, SETTINGS_HOUSEHOLD } from 'helpers/routes'
import { formatPageTitle } from 'helpers/pageTitle'
import { metatags } from '@roxi/routify'
import { Button, Page } from '@silintl/ui-components'

$: metatags.title = formatPageTitle('Settings')
</script>

<Page>
  <Breadcrumb />
  <p>
    <Button outlined url={SETTINGS_PERSONAL}>Personal Settings</Button>
  </p>
  <p>
    <Button outlined url={SETTINGS_HOUSEHOLD}>Household Settings</Button>
  </p>
</Page>
