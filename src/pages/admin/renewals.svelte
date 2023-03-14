<script lang="ts">
import { processPolicyRenewals } from 'data/ledger'
import { formatPageTitle } from 'helpers/pageTitle'
import { metatags } from '@roxi/routify'
import { Button, Page, setNotice } from '@silintl/ui-components'

let isProcessing = false

const onClickProcess = () => {
  isProcessing = true
  processPolicyRenewals()
  setNotice('annual renewal process has been started')
}

metatags.title = formatPageTitle('Admin > Renewals')
</script>

<Page>
  <h3>Annual renewals</h3>
  <p>annual process for renewing coverage</p>
  <p></p>
  <div class="my-1">
    <Button class="mr-1" raised on:click={onClickProcess} disabled={isProcessing}>process</Button>
  </div>
</Page>
