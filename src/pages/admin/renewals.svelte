<script lang="ts">
import { AnnualRenewalStatus, getPolicyRenewalStatus, processPolicyRenewals } from 'data/ledger'
import { formatPageTitle } from 'helpers/pageTitle'
import { metatags } from '@roxi/routify'
import { Button, Page, setNotice } from '@silintl/ui-components'
import { onMount } from 'svelte'

let isProcessing = false
let status = {} as AnnualRenewalStatus

$: disableProcessButton = isProcessing || status?.is_complete

onMount(async () => {
  status = await getPolicyRenewalStatus()
})

const onClickProcess = () => {
  isProcessing = true
  processPolicyRenewals()
  setNotice('Annual renewal process has been started')
}

const onClickRefresh = async () => {
  status = await getPolicyRenewalStatus()
}

metatags.title = formatPageTitle('Admin > Renewals')
</script>

<Page>
  <h3>Annual renewals</h3>
  <p>annual process for renewing coverage</p>
  <p>
    Number of items to renew: {status?.items_to_process?.toLocaleString() || '…'}
    {#if isProcessing && !status.is_complete}
      <Button class="ml-1" on:click={onClickRefresh}>refresh</Button>
    {/if}
  </p>
  <div class="my-1">
    <Button raised on:click={onClickProcess} disabled={disableProcessButton}>process</Button>
  </div>
</Page>
