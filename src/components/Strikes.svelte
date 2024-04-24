<script lang="ts">
import { MAX_TEXT_AREA_LENGTH as maxlength } from 'components/const'
import { createPolicyStrike, type Policy, type Strike } from 'data/policies'
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
  <header>
    <h2>Deductible Adjustments</h2>
    {#if !userIsAdmin}
      <p>
        This policy has been given a deductible adjustment for suspicious or potentially abusive behavior. Each
        deductible adjustment increases the deductible by 20%. Each deductible adjustment lasts 2 years. Multiple
        deductible adjustments can be on a policy at a time.
      </p>
    {:else}
      <Button outlined class="mb-1" prependIcon="bolt" on:click={() => (showStrikeForm = !showStrikeForm)}>
        {showStrikeForm ? 'hide' : 'Add a deductible adjustment'}
      </Button>
      {#if showStrikeForm}
        <Form class="mb-2">
          <p>
            <TextArea
              {maxlength}
              label="Add a deductible adjustment to this policy"
              rows="4"
              bind:value={strikeDescription}
            />
            <Button disabled={!strikeDescription} on:click={addStrike}>submit</Button>
          </p>
        </Form>
      {/if}
    {/if}
  </header>

  <Datatable>
    <HeaderRow>
      <HeaderItem>Date Created</HeaderItem>
      <HeaderItem>Last Updated</HeaderItem>
      <HeaderItem>Description</HeaderItem>
    </HeaderRow>
    <TableBody>
      {#each strikes as strike}
        <DataRow>
          <RowItem>{formatDate(strike.created_at)}</RowItem>
          <RowItem>{formatFriendlyDate(strike.updated_at)}</RowItem>
          <RowItem>{strike.description}</RowItem>
        </DataRow>
      {:else}<DataRow>
          <RowItem><i>None</i></RowItem></DataRow
        >
      {/each}
    </TableBody>
  </Datatable>
{/if}
