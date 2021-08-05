<script>
import { onDestroy, onMount } from 'svelte'
import { MDCMenu } from '@material/menu'
import { createEventDispatcher } from 'svelte'

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
</script>

<div class="mdc-menu mdc-menu-surface" bind:this={element}>
  <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
    {#each menuItems as {icon, label, url}, i}
      <li class="mdc-list-item" role="menuitem">
        <span class="mdc-list-item__ripple"></span>
        {#if url}
          <a class="mdc-list-item" class:mdc-list-item--activated={isMenuItemActive(currentUrl, url)} href={url}
            aria-current={isMenuItemActive(currentUrl, url) ? "page" : null} tabindex={i === 0 ? 0 : undefined}>
            {#if icon}
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">{icon}</i>
            {/if}
            {#if label}
              <span class="mdc-list-item__text">{label}</span>
            {/if}
          </a>
        {/if}
      </li>
    {/each}
  </ul>
</div>