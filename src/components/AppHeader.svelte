<script lang="ts">
import user from 'data/user'
import * as routes from 'helpers/routes'
import Progress from './progress/Progress.svelte'
import { beforeUrlChange } from '@roxi/routify'
import { Badge, IconButton, isAboveMobile, Menu, MenuItem } from '@silintl/ui-components'
import { createEventDispatcher, onMount } from 'svelte'

const menuItems: MenuItem[] = [
  {
    icon: 'settings',
    label: 'Personal settings',
    url: routes.SETTINGS_PERSONAL,
  },
  {
    icon: 'logout',
    label: 'Sign out',
    url: routes.LOGOUT,
  },
]

let showImage = true
let alt = 'avatar'
let showDrawerButton: boolean
let menuOpen = false
let nameOfUser: string
let currentUrl: string

const dispatch = createEventDispatcher()

$: src = $user.photo_file?.url
$: ownerInitial = $user.first_name?.charAt(0) || ''
$: nameOfUser = $user.id ? $user.first_name + ' ' + $user.last_name : ''

onMount(() => showOrHideDrawerButton())

$beforeUrlChange((event?: PopStateEvent, route?: ClientNodeApi) => {
  currentUrl = route?.path || ''
  return true
})

const avatarError = () => (showImage = false)
const toggleMenu = () => (menuOpen = !menuOpen)
const showOrHideDrawerButton = () => (isAboveMobile() ? (showDrawerButton = false) : (showDrawerButton = true))
const toggleDrawerHandler = () => dispatch('toggleDrawer')
</script>

<style>
header {
  background-color: #fff;
  min-height: 4rem;
}

.clickable:hover {
  cursor: pointer;
}

img {
  height: 36px;
  width: 36px;
}

.name-of-user {
  color: rgba(0, 0, 0, 0.87); /* Color is set to match the left menu's text. */
  margin-right: 1ex;
}
</style>

<svelte:window on:resize={showOrHideDrawerButton} />

<header class="flex justify-between align-items-center w-100">
  <div class="flex justify-start">
    {#if showDrawerButton}
      <IconButton on:click={toggleDrawerHandler} icon={'menu'} />
    {/if}
  </div>

  <div id="toolbar" class="flex justify-end toolbar mdc-menu-surface--anchor">
    <button class="mdc-button clickable pr-1" on:click={toggleMenu}>
      <span class="name-of-user">{nameOfUser}</span>
      {#if showImage && src}
        <img {src} {alt} on:error={avatarError} />
      {:else}
        <Badge padding=".4em" color="#005CB9">{ownerInitial}</Badge>
      {/if}
    </button>

    <Menu bind:menuOpen {menuItems} {currentUrl} />
  </div>
</header>

<Progress />
