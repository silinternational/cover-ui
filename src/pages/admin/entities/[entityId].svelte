<script lang="ts">
import { Breadcrumb, TextFieldWithLabel } from 'components'
import { EntityCode, entityCodes, getEntity, updateEntity } from 'data/entityCodes'
import { entityDetails } from 'helpers/routes'
import { onMount } from 'svelte'
import { Button, Page, setNotice } from '@silintl/ui-components'

export let entityId: string

let entity = {} as EntityCode

onMount(async () => {
  entity = $entityCodes.find((e) => e.id === entityId) || (await getEntity(entityId))
})

$: breadcrumbLinks = [
  { name: 'Entities', url: '/admin/entities' },
  { name: entity.code, url: entityDetails(entityId) },
]

const onSave = async () => {
  entity = await updateEntity(entity)

  setNotice('Entity updated successfully')
}
</script>

<Page>
  <Breadcrumb links={breadcrumbLinks} />

  {#if entity.id}
    <div class="my-1">
      <h4>Code: {entity.code}</h4>

      <TextFieldWithLabel label="Name" bind:value={entity.name} />

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
