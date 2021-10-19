<script lang="ts">
import AppFooter from './AppFooter.svelte'
import AppHeader from './AppHeader.svelte'
import { goto } from '@roxi/routify'
import { Button, Drawer, Menu } from '@silintl/ui-components'
import { ROOT } from 'helpers/routes'

export let menuItems: any[] = []

const roleMenuItems = [
  { icon: 'gavel', label: 'Steward', url: '/steward/home' },
  { icon: 'work', label: 'Department Name', url: '/customer/home/[departmentPolicyId]' },
  { icon: 'family_restroom', label: 'Household', url: '/customer/home/[householdPolicyId]' },
]

let roleMenuOpen = false
let roleMenuSelection = 'Steward' // TEMP example
let toggle = false

const logoClickHandler = () => $goto(ROOT)
const toggleRoleMenu = () => {
  roleMenuOpen = !roleMenuOpen
}
</script>

<style>
.role-menu {
  margin-left: 12px;
}
#role-menu-options-container {
  position: absolute;
}
</style>

<Drawer miniMenu modal hideForPhonesOnly {toggle} {menuItems} title="Covered" class="auto-width border-white">
  <span class="pointer" on:click={logoClickHandler} slot="header">
    <img class="w-100" src="/logo.svg" alt="Cover" />
  </span>

  <AppHeader on:toggleDrawer={() => (toggle = !toggle)} />

  <div class="role-menu pt-1" slot="drawer-content-top">
    <Button appendIcon="arrow_drop_down" on:click={toggleRoleMenu}>{roleMenuSelection}</Button>
    <div id="role-menu-options-container">
      <Menu bind:menuOpen={roleMenuOpen} menuItems={roleMenuItems} />
    </div>
  </div>

  <slot />

  <AppFooter />
</Drawer>
