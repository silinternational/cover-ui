<script lang="ts">
import { Breadcrumb, Description, SearchableSelect } from 'components'
import { affiliations } from 'data/policies'
import { Button, TextField, Page, setNotice } from '@silintl/ui-components'

let account = ''
let affiliation = ''
let costCenter = ''
let groupName = ''
let entityCode = ''

const onCreatePolicy = (event: CustomEvent) => {
  // TEMP
  console.log({
    account,
    affiliation,
    costCenter,
    entityCode,
    groupName,
  })
}
</script>

<style>
.required {
  color: var(--mdc-theme-status-error);
}
</style>

<Page>
  <Breadcrumb />

  <p>
    <span class="header">Group name<span class="required">*</span></span>
    <TextField autofocus bind:value={groupName} />
    <Description>Appears in your statements</Description>
  </p>

  <p>
    <span class="header">Affiliation<span class="required">*</span></span>
    <SearchableSelect options={$affiliations} bind:choice={affiliation} padding="16px" />
  </p>

  <p>
    <span class="header">Entity code<span class="required">*</span></span>
    <TextField placeholder="ABC" bind:value={entityCode} />
  </p>

  <p>
    <span class="header">Cost center<span class="required">*</span></span>
    <TextField placeholder="ABCD12" bind:value={costCenter} />
  </p>

  <p>
    <span class="header">Account<span class="required">*</span></span>
    <TextField placeholder="12345" bind:value={account} />
  </p>

  <Button raised on:click={onCreatePolicy}>Create policy</Button>
</Page>
