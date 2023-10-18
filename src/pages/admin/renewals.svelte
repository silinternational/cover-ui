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
import { Button, Card, Page, setNotice } from '@silintl/ui-components'
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
  <h1>Renewals</h1>

  <Card class="tw-w-96 tw-max-w-full tw-my-6">
    <h2>Annual</h2>
    <p>Annual process for renewing coverage</p>
    <p>
      Number of items to renew: {annualStatus?.items_to_process?.toLocaleString() || '…'}
      {#if isProcessingAnnual && !annualStatus.is_complete}
        <Button class="ml-1" on:click={onClickRefreshAnnual}>Refresh</Button>
      {/if}
    </p>
    <div class="my-1">
      <Button raised on:click={onClickProcessAnnual} disabled={disableProcessAnnualButton}>Process Annual</Button>
    </div>
  </Card>

  <Card class="tw-w-96 tw-max-w-full tw-my-6">
    <h2>Monthly</h2>
    <p>Monthly process for renewing coverage: This should be done between the 20th and the end of the month.</p>
    <p>
      Number of items to renew: {monthlyStatus?.items_to_process?.toLocaleString() || '…'}
      {#if isProcessingMonthly && !monthlyStatus.is_complete}
        <Button class="ml-1" on:click={onClickRefreshMonthly}>Refresh</Button>
      {/if}
    </p>
    <div class="my-1">
      <Button raised on:click={onClickProcessMonthly} disabled={disableProcessMonthlyButton}>Process Monthly</Button>
    </div>
  </Card>
</Page>
