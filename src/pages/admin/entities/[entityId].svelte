<script lang="ts">
import { Breadcrumb } from 'components'
import { type EntityCode, entityCodes, getEntity, updateEntity } from 'data/entityCodes'
import { formatPageTitle } from 'helpers/pageTitle'
import { entityDetails } from 'helpers/routes'
import { metatags } from '@roxi/routify'
import { onMount } from 'svelte'
import { Button, Page, TextField, setNotice } from '@silintl/ui-components'

export let entityId: string

let entity = {} as EntityCode

metatags.title = formatPageTitle(`Admin > Entities > ${entityId}`)

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

      <TextField required label="Name" bind:value={entity.name} />

      <TextField required label="Income Account" bind:value={entity.income_account} />

      <TextField label="Parent Entity (optional)" bind:value={entity.parent_entity} />

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
