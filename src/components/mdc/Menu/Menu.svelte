<!-- https://github.com/material-components/material-components-web/tree/master/packages/mdc-menu -->
<script>
import { onDestroy, onMount } from 'svelte'
import { MDCMenu } from '@material/menu'
import { createEventDispatcher } from 'svelte'
import { goto } from '@roxi/routify';

export let menuItems = []
export let menuToggler = false

let menu = {}
let element = {}

const dispatch = createEventDispatcher()

$: currentUrl = window.location.pathname
$: menu.open = menuToggler

onMount(() => {
  menu = new MDCMenu(element)

  menu.setDefaultFocusState() //TODO figure out how to use this method and set focus

  return () => menu.destroy()
})

onDestroy(() => {
  dispatch('syncToggler')
})

const isMenuItemActive = (currentUrl, menuItemUrl) => currentUrl === menuItemUrl
const handleItemClick = url => {
  if (url) {
    $goto(url)
  }
}
const onMenuClose = () => !menu.open && (menuToggler = false)
</script>
<svelte:body on:click={onMenuClose} />

<div class="mdc-menu mdc-menu-surface" bind:this={element}>
  <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
    {#each menuItems as {icon, label, url}, i}
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a on:click={() => handleItemClick(url)} role="menuitem" class="mdc-list-item" class:mdc-list-item--activated={isMenuItemActive(currentUrl, url)} href=""
        aria-current={isMenuItemActive(currentUrl, url) ? "page" : null} tabindex={i === 0 ? 0 : undefined} on:blur={onMenuClose}>
        <span class="mdc-list-item__ripple"></span>
        {#if icon}
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">{icon}</i>
        {/if}
        {#if label}
          <span class="mdc-list-item__text">{label}</span>
        {/if}
      </a>
    {/each}
  </ul>
</div>