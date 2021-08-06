<script>
import { goto } from '@roxi/routify'
import { Card, Button } from '@silintl/ui-components'

export let item = {}
export let state = { icon: 'chat' }
export let buttons = []

$: user = item.created_by || {}

const gotoItem = () => item.id && $goto(`/requests/${item.id}`)
</script>

<style>
.action {
    margin: 16px;
}

.content {
  overflow-wrap: anywhere;
  padding-bottom: .5rem;
}

.multi-line-truncate {
  /* See https://stackoverflow.com/a/13924997 and https://caniuse.com/#search=line-clamp for details. */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* number of lines to show */
}

.bg-color {
  background: #eef2fa;
}

.ml-50px {
  margin-left: 50px;
}

.pl-10px {
  padding-left: 10px;
}

.pl-50px {
  padding-left: 50px;
}
</style>

<Card isClickable noPadding on:click={gotoItem} on:keypress={gotoItem} class="height-fit-content py-0 {$$props.class}">
  <div class="flex justify-start align-items-center bg-color black mb-2 p-1 pl-50px">
    <span class="material-icons">{state.icon}</span>

    <div class="mdc-theme--primary pl-10px">
      <div class="mdc-typography--headline6 multi-line-truncate content">{item.title}</div>
      <div class="multi-line-truncate fs-14">{item.message}</div>
    </div>
  </div>

  <div class="mdc-typography--headline5 multi-line-truncate content ml-50px">
    {item.name}
  </div>

  <div class="content multi-line-truncate ml-50px">
    {item.accountable_person}
  </div>

  <div class="action pb-2 ml-50px" slot="actions">
    {#if buttons}
      {#each buttons as btn}
        <Button raised url={btn.url}>{btn.label}</Button>
      {/each}
    {/if}

    <div class="fs-12 gray mt-1">
      "Last changed {item.last_changed} ago"
    </div>
  </div>
</Card>