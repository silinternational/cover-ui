<script lang="ts">
import AppFooter from '../components/AppFooter.svelte'
import AppHeader from '../components/AppHeader.svelte'
import { goto } from '@roxi/routify'
import { Drawer } from '@silintl/ui-components'

export let menuItems = []

let toggle = false

const logoClickHandler = () => $goto('/')
</script>

<Drawer miniMenu modal hideForPhonesOnly {toggle} {menuItems} title="Covered" class="auto-width border-white">
  <span class="pointer" on:click={logoClickHandler} slot="header">
    <img class="w-100" src="/logo.svg" alt="Cover" />
  </span>

  <AppHeader on:toggleDrawer={() => (toggle = !toggle)} />

  <slot />

  <AppFooter />
</Drawer>
