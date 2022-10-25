<script lang="ts">
import { EntityCode, entityCodes, loadEntityCodes } from 'data/entityCodes'
import { entityDetails } from 'helpers/routes'
import { goto } from '@roxi/routify'
import { onMount } from 'svelte'
import { Datatable, Page } from '@silintl/ui-components'

let entities = [] as EntityCode[]

onMount(async () => {
  entities = await loadEntityCodes() //Todo: use the store when bug is fixed: multiple keys
})
</script>

<Page>
  <div class="flex justify-between align-items-center">
    <h4>Entities</h4>
  </div>
  {#if $entityCodes.length}
    <Datatable>
      <Datatable.Header>
        <Datatable.Header.Item>Name</Datatable.Header.Item>
        <Datatable.Header.Item>Code</Datatable.Header.Item>
        <Datatable.Header.Item>Status</Datatable.Header.Item>
        <Datatable.Header.Item>Income Account</Datatable.Header.Item>
        <Datatable.Header.Item>Parent Entity</Datatable.Header.Item>
      </Datatable.Header>
      <Datatable.Data>
        {#each $entityCodes as entityCode (entityCode.id)}
          <Datatable.Data.Row on:click={() => $goto(entityDetails(entityCode.id))} clickable>
            <Datatable.Data.Row.Item>{entityCode.name}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>{entityCode.code}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>{entityCode.active ? 'Active' : 'Inactive'}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>{entityCode.income_account || ''}</Datatable.Data.Row.Item>
            <Datatable.Data.Row.Item>{entityCode.parent_entity || ''}</Datatable.Data.Row.Item>
          </Datatable.Data.Row>
        {/each}
      </Datatable.Data>
    </Datatable>
  {:else}
    <p>Loading...</p>
  {/if}
</Page>
