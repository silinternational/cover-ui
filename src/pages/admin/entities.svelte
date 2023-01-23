<script lang="ts">
import EntityModal from './_components/EntityModal.svelte'
import { entityCodes, loadEntityCodes } from 'data/entityCodes'
import { entityDetails } from 'helpers/routes'
import { goto } from '@roxi/routify'
import { onMount } from 'svelte'
import { Datatable, Page, setNotice } from '@silintl/ui-components'

onMount(() => $entityCodes.length || loadEntityCodes())

const onSubmit = (event: CustomEvent) => {
  //TODO: use endpoint
  console.log(event.detail)

  setNotice('Sorry, feature is not supported yet')
}
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

  <EntityModal on:submit={onSubmit} />
</Page>
