<script lang="ts">
import { MAX_TEXT_AREA_LENGTH as maxlength } from 'components/const'
import { createPolicyStrike, Policy, Strike } from 'data/policies'
import { formatDate, formatFriendlyDate } from 'helpers/dates'
import { Button, Datatable, Form, TextArea } from '@silintl/ui-components'

export let userIsAdmin = false
export let policy = {} as Policy

let strikeDescription = ''
let showStrikeForm = false

const HeaderRow = Datatable.Header
const HeaderItem = Datatable.Header.Item
const TableBody = Datatable.Data
const DataRow = Datatable.Data.Row
const RowItem = Datatable.Data.Row.Item

$: strikes = policy.strikes || ([] as Strike[])

const addStrike = () => {
  createPolicyStrike(policy.id, strikeDescription)
  strikeDescription = ''
}
</script>

{#if strikes.length || userIsAdmin}
  <h4>Strikes</h4>
  {#if !userIsAdmin}
    <p>
      This policy has been given a strike for suspicious or potentially abusive behavior. Each strike increases the
      deductible by 20%. Each strike lasts 2 years. Multiple strikes can be on a policy at a time.
    </p>
  {:else}
    <Button class="mb-1" on:click={() => (showStrikeForm = !showStrikeForm)}>
      {showStrikeForm ? 'hide' : 'add a strike'}
    </Button>
    {#if showStrikeForm}
      <Form class="mb-2">
        <p>
          <TextArea {maxlength} label="Add a Strike to this policy" rows="4" bind:value={strikeDescription} />
          <Button disabled={!strikeDescription} on:click={addStrike}>submit</Button>
        </p>
      </Form>
    {/if}
  {/if}
  <Datatable>
    <HeaderRow>
      <HeaderItem>Date Created</HeaderItem>
      <HeaderItem>Updated At</HeaderItem>
      <HeaderItem>Description</HeaderItem>
    </HeaderRow>
    <TableBody>
      {#each strikes as strike}
        <DataRow>
          <RowItem>{formatDate(strike.created_at)}</RowItem>
          <RowItem>{formatFriendlyDate(strike.updated_at)}</RowItem>
          <RowItem>{strike.description}</RowItem>
        </DataRow>
      {/each}
    </TableBody>
  </Datatable>
{/if}
