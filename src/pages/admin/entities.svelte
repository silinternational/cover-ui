<script lang="ts">
import { Entity, getEntities } from 'data/entityCodes'
import { entityDetails } from 'helpers/routes'
import { goto } from '@roxi/routify'
import { onMount } from 'svelte'
import { Datatable, Page } from '@silintl/ui-components'

let entities = [] as Entity[]

onMount(async () => {
  entities = await getEntities()
})

$: console.log(entities)
</script>

<Page>
  <div class="flex justify-between align-items-center">
    <h4>Entities</h4>
  </div>

  <Datatable>
    <Datatable.Header>
      <Datatable.Header.Item>Name</Datatable.Header.Item>
      <Datatable.Header.Item>Code</Datatable.Header.Item>
      <Datatable.Header.Item>Status</Datatable.Header.Item>
      <Datatable.Header.Item>Income Account</Datatable.Header.Item>
      <Datatable.Header.Item>Parent Entity</Datatable.Header.Item>
    </Datatable.Header>
    <Datatable.Data>
      {#each entities as entity (entity.id)}
        <Datatable.Data.Row on:click={() => $goto(entityDetails(entity.id))} clickable>
          <Datatable.Data.Row.Item>{entity.name + ' - ' + entity.code}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{entity.code}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{entity.active ? 'Active' : 'Inactive'}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{entity.income_account || ''}</Datatable.Data.Row.Item>
          <Datatable.Data.Row.Item>{entity.parent_entity || ''}</Datatable.Data.Row.Item>
        </Datatable.Data.Row>
      {/each}
    </Datatable.Data>
  </Datatable>
</Page>
