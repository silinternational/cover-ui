<script lang="ts">
import { AnnualRenewalStatus, getAnnualPolicyRenewalStatus, processAnnualPolicyRenewals } from 'data/ledger'
import { formatPageTitle } from 'helpers/pageTitle'
import { metatags } from '@roxi/routify'
import { Button, Page, setNotice } from '@silintl/ui-components'
import { onMount } from 'svelte'

let isProcessing = false
let annualStatus = {} as AnnualRenewalStatus

$: disableProcessButton = isProcessing || annualStatus?.is_complete

onMount(async () => {
  annualStatus = await getAnnualPolicyRenewalStatus()
})

const onClickProcess = () => {
  isProcessing = true
  processAnnualPolicyRenewals()
  setNotice('Annual renewal process has been started')
}

const onClickRefresh = async () => {
  annualStatus = await getAnnualPolicyRenewalStatus()
}

metatags.title = formatPageTitle('Admin > Renewals')
</script>

<Page>
  <h3>Annual renewals</h3>
  <p>annual process for renewing coverage</p>
  <p>
    Number of items to renew: {annualStatus?.items_to_process?.toLocaleString() || '…'}
    {#if isProcessing && !annualStatus.is_complete}
      <Button class="ml-1" on:click={onClickRefresh}>refresh</Button>
    {/if}
  </p>
  <div class="my-1">
    <Button raised on:click={onClickProcess} disabled={disableProcessButton}>process</Button>
  </div>
</Page>
