<script lang="ts">
import AuditsOrRepairTable from './_components/AuditsOrRepairTable.svelte'
import { audits, repairAudits, repairedAudits, runAudits } from 'data/audits'
import { formatPageTitle } from 'helpers/pageTitle'
import { isEqual } from 'lodash-es'
import { metatags } from '@roxi/routify'
import { Button, Page, setNotice } from '@silintl/ui-components'

metatags.title = formatPageTitle('Admin > Audit')

let utcDate = new Date().toISOString().split('T')[0]

$: auditItems = $audits?.items || []
$: repairedItems = $repairedAudits?.items || []
$: haveAuditResults = auditItems?.length
$: haveRepairResults = repairedItems?.length

const onClick = () => {
  runAudits(utcDate)
}

const repair = async () => {
  try {
    await repairAudits(utcDate)
    const responseIsEqualToAudits = isEqual($audits.items, $repairedAudits.items)
    setNotice(
      responseIsEqualToAudits
        ? `All item records found to be at fault have been repaired.`
        : `Some item records found to be at fault were not repaired. Try running another audit.`
    )
  } catch {
    setNotice(`There was an error repairing the item records. Please try again.`)
  }
}
</script>

<Page>
  <h4>Audits results (items that were incorrectly renewed and billed)</h4>

  <div class="my-1">
    <Button class="mr-1" raised on:click={onClick}>run audits</Button>

    <Button prependIcon="build" outlined on:click={repair} disabled={!haveAuditResults}>repair</Button>
  </div>
  <AuditsOrRepairTable items={auditItems} />

  {#if haveRepairResults}
    <h4>Repair results (item records that have been repaired)</h4>
    <div class="my-1">
      <Button class="mr-1" raised on:click={onClick}>run audits</Button>

      <Button prependIcon="build" outlined on:click={repair} disabled={!haveAuditResults}>repair</Button>
    </div>
    <AuditsOrRepairTable items={repairedItems} />
  {/if}
</Page>
