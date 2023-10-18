<script lang="ts">
import { AnnualRenewalStatus, getAnnualPolicyRenewalStatus, processAnnualPolicyRenewals } from 'data/ledger'
import { formatPageTitle } from 'helpers/pageTitle'
import { metatags } from '@roxi/routify'
import { Button, Page, setNotice } from '@silintl/ui-components'
import { onMount } from 'svelte'

let isProcessing = false
let status = {} as AnnualRenewalStatus

$: disableProcessButton = isProcessing || status?.is_complete

onMount(async () => {
  status = await getAnnualPolicyRenewalStatus()
})

const onClickProcess = () => {
  isProcessing = true
  processAnnualPolicyRenewals()
  setNotice('Annual renewal process has been started')
}

const onClickRefresh = async () => {
  status = await getAnnualPolicyRenewalStatus()
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
