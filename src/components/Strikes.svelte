<script lang="ts">
import { MAX_TEXT_AREA_LENGTH as maxlength } from 'components/const'
import { createPolicyStrike, Policy, Strike } from 'data/policies'
import { formatDate, formatFriendlyDate } from 'helpers/dates'
import { Button, Datatable, Form, TextArea } from '@silintl/ui-components'

export let userIsAdmin = false
export let policy = {} as Policy

let strikeDescription = ''

const HeaderRow = Datatable.Header
const HeaderItem = Datatable.Header.Item
const TableBody = Datatable.Data
const DataRow = Datatable.Data.Row
const RowItem = Datatable.Data.Row.Item

$: strikes = policy.strikes || ([] as Strike[])

const addStrike = () => {
  createPolicyStrike(policy.id, strikeDescription)
}
</script>

{#if userIsAdmin}
  <h4>Strikes</h4>
  <Form class="mb-2">
    <p>
      <TextArea {maxlength} label="Add a Strike to this policy" rows="4" bind:value={strikeDescription} />
      <Button disabled={!strikeDescription} on:click={addStrike}>add a strike</Button>
    </p>
  </Form>
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
