<script lang="ts">
import AppFooter from './AppFooter.svelte'
import AppHeader from './AppHeader.svelte'
import { showApp } from '../authn'
import type { UserAppRole } from 'data/user'
import RoleAndPolicyMenu from './RoleAndPolicyMenu.svelte'
import type { Policy } from 'data/policies'
import { beforeUrlChange, goto } from '@roxi/routify'
import { Drawer } from '@silintl/ui-components'
import { ROOT } from 'helpers/routes'
import Watermark from './Watermark.svelte'
import { onMount } from 'svelte'

export let menuItems: any[]
export let myPolicies: Policy[]
export let role: UserAppRole

const isNotProduction = process.env.CF_PAGES_BRANCH !== 'main'

let drawerEl = {} as any
let drawerWidth: string
let toggle = false

onMount(() => {
  drawerEl = document.querySelector('.mdc-drawer')
})

$: drawerWidth = `${drawerEl?.offsetWidth || 0}px`
$: currentUrl = window.location.pathname

$beforeUrlChange((event, route, { url }) => {
  currentUrl = url
  return true
})

const logoClickHandler = () => $goto(ROOT)
</script>

<style>
.role-and-policy-menu {
  margin-left: 12px;
}
.logo {
  width: 10rem;
  display: block;
  margin: 0 auto;
}
</style>

<Drawer
  {currentUrl}
  modal
  hideForPhonesOnly
  {toggle}
  {menuItems}
  title="Covered"
  class="border-white {$showApp ? 'opacity1' : 'opacity0'}"
>
  <span class="pointer" on:click={logoClickHandler} slot="header">
    <img class="logo" src="/logo.svg" alt="Cover" />
  </span>

  <AppHeader on:toggleDrawer={() => (toggle = !toggle)} />

  <div class="role-and-policy-menu pt-1" slot="drawer-content-top">
    <RoleAndPolicyMenu {myPolicies} {role} on:policy on:role />
  </div>

  <slot />
  {#if $showApp}
    <AppFooter rightMargin={drawerWidth} />
  {/if}

  {#if isNotProduction}
    <Watermark text="DEVELOPMENT VERSION" />
  {/if}
</Drawer>
