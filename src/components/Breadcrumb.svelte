<script lang="ts">
import { HOME } from 'helpers/routes'
import { url } from '@roxi/routify'

export let links: { url?: string; name?: string, icon?: string }[] = []
export let hasHome = false

let urls: { url: string; name: string, icon?: string }[] = []

$: if (links.length === 0) {
  let path = $url().split('/')

  while (path.length > 0) {
    let name = path[path.length - 1]
    if (name !== '') {
      urls.unshift({
        url: path.join('/'),
        name: name.toLowerCase().replaceAll('-', ' '),
      })
    }

    path.pop()
  }
} else {
  urls = []
  links.forEach((val) => {
    if (val.url && val.name) {
      urls = [...urls, { url: val.url, name: val.name, icon: val?.icon }]
    }
  })
}
</script>

<style>
a {
  text-decoration: none;
  color: var(--mdc-theme-primary);
}
.breadcrumb-icon {
  margin: 0 3px;
  color: var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38));
}
.breadcrumb-home {
  display: inherit;
  color: var(--mdc-theme-primary);
}
</style>

<div class="flex text-align-center align-items-center {$$props.class}">
  <!-- svelte-ignore a11y-invalid-attribute -->
  {#if hasHome}
    <a href={HOME} class="capitalize">
      <i class="material-icons breadcrumb-icon breadcrumb-home" aria-hidden="true">
        home
      </i>
    </a>
    <i class="material-icons breadcrumb-icon" aria-hidden="true">
      chevron_right
    </i>
  {/if}
  {#each urls as val, i}
    <!-- svelte-ignore a11y-invalid-attribute -->
    {#if val.icon}
      <i class="material-icons breadcrumb-icon" aria-hidden="true">
        {val.icon}
      </i>
    {/if}
      <a href={val.url} class="capitalize">{val.name}</a>
      {#if urls.length - 1 != i}
        <i class="material-icons breadcrumb-icon" aria-hidden="true">chevron_right</i>
      {/if}
  {/each}
</div>
