<script lang="ts">
  import {
    getAnnualPolicyRenewalStatus,
    getMonthlyPolicyRenewalStatus,
    processAnnualPolicyRenewals,
    processMonthlyPolicyRenewals,
    RenewalStatus
  } from 'data/ledger'
import { formatPageTitle } from 'helpers/pageTitle'
import { metatags } from '@roxi/routify'
import { Button, Page, setNotice } from '@silintl/ui-components'
import { onMount } from 'svelte'

let isProcessingAnnual = false
let isProcessingMonthly = false
let annualStatus = {} as RenewalStatus
let monthlyStatus = {} as RenewalStatus

$: disableProcessAnnualButton = isProcessingAnnual || annualStatus?.is_complete
$: disableProcessMonthlyButton = isProcessingMonthly || monthlyStatus?.is_complete

onMount(async () => {
  annualStatus = await getAnnualPolicyRenewalStatus()
  monthlyStatus = await getMonthlyPolicyRenewalStatus()
})

const onClickProcessAnnual = () => {
  isProcessingAnnual = true
  processAnnualPolicyRenewals()
  setNotice('Annual renewal process has been started')
}

const onClickProcessMonthly = () => {
  isProcessingMonthly = true
  processMonthlyPolicyRenewals()
  setNotice('Monthly renewal process has been started')
}

const onClickRefreshAnnual = async () => {
  annualStatus = await getAnnualPolicyRenewalStatus()
}

const onClickRefreshMonthly = async () => {
  monthlyStatus = await getMonthlyPolicyRenewalStatus()
}

metatags.title = formatPageTitle('Admin > Renewals')
</script>

<Page>
  <h2>Annual Renewals</h2>
  <p>Annual process for renewing coverage</p>
  <p>
    Number of items to renew: {annualStatus?.items_to_process?.toLocaleString() || '…'}
    {#if isProcessingAnnual && !annualStatus.is_complete}
      <Button class="ml-1" on:click={onClickRefreshAnnual}>refresh</Button>
    {/if}
  </p>
  <div class="my-1">
    <Button raised on:click={onClickProcessAnnual} disabled={disableProcessAnnualButton}>process</Button>
  </div>

  <h2>Monthly Renewals</h2>
  <p>Monthly process for renewing coverage</p>
  <p>
    Number of items to renew: {monthlyStatus?.items_to_process?.toLocaleString() || '…'}
    {#if isProcessingMonthly && !monthlyStatus.is_complete}
      <Button class="ml-1" on:click={onClickRefreshMonthly}>refresh</Button>
    {/if}
  </p>
  <div class="my-1">
    <Button raised on:click={onClickProcessMonthly} disabled={disableProcessMonthlyButton}>process</Button>
  </div>
</Page>
