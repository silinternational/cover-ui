<script lang="ts">
import EntityModal from './_components/EntityModal.svelte'
import { createEntity, entityCodes, loadEntityCodes } from 'data/entityCodes'
import { entityDetails } from 'helpers/routes'
import { goto } from '@roxi/routify'
import { onMount } from 'svelte'
import { Datatable, Page, setNotice } from '@silintl/ui-components'

onMount(() => $entityCodes.length || loadEntityCodes())

const onSubmit = async (event: CustomEvent) => {
  const duplicate = $entityCodes.find((entity) => entity.code === event.detail.code)
  if (duplicate) {
    setNotice(`Entity code ${duplicate.code} already exists`)
    return
  }
  const entity = await createEntity(event.detail)

  setNotice(`Succesfully created entity ${entity.name}`)
}
</script>

<Page>
  <div class="flex justify-between align-items-center">
    <h4>Entities</h4>
  </div>
  <EntityModal on:submit={onSubmit} />
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
