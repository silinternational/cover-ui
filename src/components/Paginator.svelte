<script lang="ts">
import type { PaginatedData } from 'data/types/PaginatedData'
import { IconButton, Select } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

type SelectOption = { id: string; name: string }

const dispatch = createEventDispatcher<{ paginate: { page: number; limit: number } }>()

export let pageData: PaginatedData
export let thingName = 'items'
export let limitOptions = [10, 20, 50, 100]
export let limitSelection = ''

$: limitSelectOptions = limitOptions.map((o) => ({ id: 'limit-' + o, name: o.toString() }) as SelectOption)

const onClickFirst = () => {
  dispatch('paginate', { page: 1, limit: pageData.per_page })
}

const onClickLast = () => {
  dispatch('paginate', { page: pageData.total_pages, limit: pageData.per_page })
}

const onClickPrevious = () => {
  if (pageData.page > 1) {
    dispatch('paginate', { page: pageData.page - 1, limit: pageData.per_page })
  }
}

const onClickNext = () => {
  if (pageData.page < pageData.total_pages) {
    dispatch('paginate', { page: pageData.page + 1, limit: pageData.per_page })
  }
}

const onSetLimitDefault = () => {
  if (!limitSelection && limitSelectOptions?.length > 0) limitSelection = limitSelectOptions[0].id
}

const onLimitChange = (event: CustomEvent<SelectOption>) => {
  if (event.detail.name) {
    let itemsPerPage = Number(event.detail.name)
    // re-jigger the page number such that the current slice of data (at least the first item) is in the newly selected page
    let newPage = Math.floor(pageData.offset / itemsPerPage) + 1
    dispatch('paginate', { page: newPage, limit: itemsPerPage })
  }
}
</script>

<style>
.paginator {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.right-side {
  display: flex;
}
.p-buttons {
  display: flex;
  align-items: center;
}
.limit-selector {
  padding-top: 0.5em;
}
</style>

{#if pageData}
  <div class="paginator">
    <div class="left-side">
      {#if pageData.current_entries_size > 0}
        Showing {pageData.offset + 1} to {pageData.offset + pageData.current_entries_size} of {pageData.total_entries_size}
        {thingName}
      {:else}
        0 {thingName} found
      {/if}
    </div>
    <div class="right-side">
      <div class="p-buttons">
        <IconButton icon="first_page" on:click={onClickFirst} ariaLabel="first" />
        <IconButton icon="chevron_left" on:click={onClickPrevious} ariaLabel="previous" />
        <div>Page {pageData.page} of {pageData.total_pages}</div>
        <IconButton icon="chevron_right" on:click={onClickNext} ariaLabel="next" />
        <IconButton icon="last_page" on:click={onClickLast} ariaLabel="last" />
      </div>
      <div class="limit-selector">
        <Select
          label={thingName + ' per page'}
          on:change={onLimitChange}
          on:populated={onSetLimitDefault}
          options={limitSelectOptions}
          selectedID={limitSelection}
          width="8em"
        />
      </div>
    </div>
  </div>
{/if}
