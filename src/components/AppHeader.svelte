<script lang="ts">
import Error from './Error.svelte'
import Progress from './progress/Progress.svelte'
import { Badge, IconButton, isAboveMobile } from '@silintl/ui-components'
import { createEventDispatcher, onMount } from 'svelte'
import { Menu } from './index';
import user from '../authn/user'

const menuItems = [
  {
    icon: 'settings', label: 'User settings', url: '/settings/personal'
  },
  {
    icon: 'logout', label: 'Sign out', url: '/logout'
  }
]

let showImage = true
let alt = 'avatar'
let showDrawerButton: boolean
let menuOpen = false

const dispatch = createEventDispatcher()

$: src = $user.photo_file?.url
$: ownerInitial = $user.first_name?.charAt(0) || ''

onMount(() => showOrHideDrawerButton())

const avatarError = () => showImage = false
const toggleMenu = () => menuOpen = !menuOpen
const showOrHideDrawerButton = () => isAboveMobile() ? (showDrawerButton = false) : (showDrawerButton = true)
const toggleDrawerHandler = () => dispatch('toggleDrawer') //TODO toggle drawer
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
</style>
<svelte:window on:resize={showOrHideDrawerButton}/>

<header class="flex justify-between align-items-center w-100">
  <div class="flex justify-start">
    {#if showDrawerButton}
      <IconButton on:click={toggleDrawerHandler} icon={'menu'}/>
    {/if}
  </div>

  <div id="toolbar" class="flex justify-end toolbar mdc-menu-surface--anchor">
    <button class="mdc-button clickable pr-1" on:click={toggleMenu} >
      {#if showImage && src}
        <img {src} {alt} on:error={avatarError}/>
      {:else}
        <Badge padding='.4em' color='#005CB9'>{ownerInitial}</Badge>
      {/if}
    </button>

    <Menu bind:menuOpen {menuItems} on:syncToggler={() => menuOpen = false}/>
  </div>
</header>

<Progress />

<Error />
