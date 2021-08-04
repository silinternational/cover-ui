<script>
import Error from './Error.svelte'
import Progress from './progress/Progress.svelte'
import { Badge, Button, IconButton, isAboveTablet } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte';

let showImage = true
let alt = 'avatar'
let showDrawerButton

const dispatch = createEventDispatcher()

const user = {
  nickname: 'Jon',
  avatar_url: '',
}

$: src = user.avatar_url
$: ownerInitial = user.nickname?.charAt(0) || ''

const avatarError = () => showImage = false
const openMenu = () => console.log('this will open the menu')
const showOrHideDrawerToggle = () => isAboveTablet() ? (showDrawerButton = false) : (showDrawerButton = true)
const toggleDrawerHandler = () => dispatch('toggleDrawer') //TODO toggle drawer
</script>

<style>
header {
  background-color: #fff;
  min-height: 4rem;
}
</style>
<svelte:window on:resize={showOrHideDrawerToggle}/>

<header class="flex justify-between align-items-center w-100">
  <div class="flex justify-start">
    {#if showDrawerButton}
      <IconButton on:click={toggleDrawerHandler} icon={'menu'}/>
    {/if}
  </div>

  <div class="flex justify-end">
    <Button on:click={openMenu} class="pr-1">
      {#if showImage && src}
          <img {src} {alt} on:error={avatarError}/>
      {:else}
          <Badge padding='.4em' color='#005CB9'>{ownerInitial}</Badge>
      {/if}
    </Button>
  </div>
</header>

<Progress />

<Error />