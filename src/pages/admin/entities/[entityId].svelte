<script lang="ts">
import { Breadcrumb, TextFieldWithLabel } from 'components'
import { Entity, getEntity, updateEntity } from 'data/entityCodes'
import { entityDetails } from 'helpers/routes'
import { onMount } from 'svelte'
import { Button, Page } from '@silintl/ui-components'

export let entityId: string

let entity = {} as Entity

onMount(async () => {
  entity = await getEntity(entityId)
})

$: breadcrumbLinks = [
  { name: 'Entities', url: '/admin/entities' },
  { name: entity.name, url: entityDetails(entityId) },
]
$: console.log('entity', entity)

const onSave = async () => {
  entity = await updateEntity(entity)
}
</script>

<Page>
  <Breadcrumb links={breadcrumbLinks} />

  {#if entity.id}
    <div class="my-1">
      <TextFieldWithLabel label="name" bind:value={entity.name} />

      <TextFieldWithLabel label="Code" bind:value={entity.code} />

      <TextFieldWithLabel label="Income Account" bind:value={entity.income_account} />

      <TextFieldWithLabel label="Parent Entity" bind:value={entity.parent_entity} />

      <label>
        <input type="checkbox" bind:checked={entity.active} />
        Active
      </label>
    </div>

    <Button raised on:click={onSave}>Save</Button>
  {:else}
    <p>Loading...</p>
  {/if}
</Page>
