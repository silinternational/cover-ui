<script lang="ts">
import AppFooter from './AppFooter.svelte'
import AppHeader from './AppHeader.svelte'
import RoleAndPolicyMenu from './RoleAndPolicyMenu.svelte'
import type { Policy } from 'data/policies'
import { goto } from '@roxi/routify'
import { Drawer } from '@silintl/ui-components'
import { ROOT } from 'helpers/routes'

export let menuItems: any[] = []
export let policies: Policy[] = []

let toggle = false

const logoClickHandler = () => $goto(ROOT)
</script>

<style>
.role-and-policy-menu {
  margin-left: 12px;
}
</style>

<Drawer miniMenu modal hideForPhonesOnly {toggle} {menuItems} title="Covered" class="auto-width border-white">
  <span class="pointer" on:click={logoClickHandler} slot="header">
    <img class="w-100" src="/logo.svg" alt="Cover" />
  </span>

  <AppHeader on:toggleDrawer={() => (toggle = !toggle)} />

  <div class="role-and-policy-menu pt-1" slot="drawer-content-top">
    <RoleAndPolicyMenu {policies} />
  </div>

  <slot />

  <AppFooter />
</Drawer>
