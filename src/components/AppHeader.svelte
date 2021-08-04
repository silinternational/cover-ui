<script>
import Error from './Error.svelte'
import Progress from './progress/Progress.svelte'
import { Badge, IconButton, isAboveTablet } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'
import Menu from './mdc/Menu/Menu.svelte'

let showImage = true
let alt = 'avatar'
let showDrawerButton
let menuToggler = false

const menuItems = [
  {
    icon: 'settings', label: 'User settings', url: '/household/settings'
  },
  {
    icon: 'logout', label: 'Sign out', url: '/logout'
  }
]

const dispatch = createEventDispatcher()

const user = { //TODO get this from the api
  nickname: 'Jon',
  avatar_url: '',
}

$: src = user.avatar_url
$: ownerInitial = user.nickname?.charAt(0) || ''

const avatarError = () => showImage = false
const toggleMenu = () => menuToggler = !menuToggler
const showOrHideDrawerToggle = () => isAboveTablet() ? (showDrawerButton = false) : (showDrawerButton = true)
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
</style>
<svelte:window on:resize={showOrHideDrawerToggle}/>

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

    <!-- TODO set menuToggler to false when menu closes -->
    <Menu autofocus bind:menuToggler {menuItems} on:syncToggler={() => menuToggler = false}/>
  </div>
</header>

<Progress />

<Error />