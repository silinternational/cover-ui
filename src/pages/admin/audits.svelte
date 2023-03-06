<script lang="ts">
import AuditsOrRepairTable from './_components/AuditsOrRepairTable.svelte'
import { audits, repairAudits, repairedAudits, runAudits } from 'data/audits'
import type { PolicyItem } from 'data/items'
import { formatPageTitle } from 'helpers/pageTitle'
import { metatags } from '@roxi/routify'
import { Button, Page, setNotice } from '@silintl/ui-components'
import { onMount } from 'svelte'

metatags.title = formatPageTitle('Admin > Audit')

let itemsWithOpenClaim: PolicyItem[] = []

let utcDate = new Date().toISOString().split('T')[0]

$: auditItems = $audits?.items || []
$: repairedItems = $repairedAudits?.items || []
$: haveAuditResults = auditItems?.length
$: haveRepairResults = repairedItems?.length
$: repairIsDisabled = !haveAuditResults || !!haveRepairResults || !!itemsWithOpenClaim.length

const onClick = () => {
  itemsWithOpenClaim = []
  runAudits(utcDate)
}

const findLockedItems = () => {
  for (let item of auditItems) {
    if (!item.can_be_updated) {
      itemsWithOpenClaim.push(item)
      itemsWithOpenClaim = itemsWithOpenClaim
    }
  }
}

const repair = async () => {
  findLockedItems()
  if (itemsWithOpenClaim.length) {
    setNotice(`Some items have active claims. Please resolve the claims before repairing the item records.`)
    return
  }
  try {
    await repairAudits(utcDate)
    setNotice('Succesfully repaired item records found to be at fault.')
  } catch {
    setNotice('There was an error repairing the item records. Please try again.')
  }
}

onMount(() => {
  haveAuditResults || runAudits(utcDate)
})
</script>

<Page>
  <h3>Audit results</h3>
  <p>items that were incorrectly renewed and billed</p>

  <div class="my-1">
    <Button class="mr-1" raised on:click={onClick}>run audits</Button>

    <Button prependIcon="build" outlined on:click={repair} disabled={repairIsDisabled}>repair</Button>
  </div>
  <AuditsOrRepairTable items={auditItems} />

  {#if itemsWithOpenClaim.length}
    <h4>Items with open claims (need to be closed before repairing to records)</h4>
    <AuditsOrRepairTable items={itemsWithOpenClaim} />
  {/if}

  {#if haveRepairResults}
    <h4>Repair results (item records that have been repaired)</h4>

    <AuditsOrRepairTable items={repairedItems} />
  {/if}
</Page>
