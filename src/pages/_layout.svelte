<script lang="ts">
import user, { isSteward } from '../authn/user'
import AppFooter from '../components/AppFooter.svelte'
import AppHeader from '../components/AppHeader.svelte'
import { goto } from '@roxi/routify'
import { Drawer } from '@silintl/ui-components'

let toggle = false

$: menuItems = [
  {},
  {
    url: '/home',
    icon: 'home',
    label: 'Home',
  },
  {
    url: '/policies',
    icon: 'description',
    label: 'Policies',
    hide: !isSteward($user),
  },
  {
    url: '/claims',
    icon: 'label',
    label: 'Claims',
  },
  {
    url: '/faq',
    icon: 'quiz',
    label: 'FAQ',
  },
  // {
  //   url: '/chat',
  //   icon: 'chat',
  //   label: 'Chat',
  // },
  {
    url: '/settings',
    icon: 'settings',
    label: 'Settings'
  },
  {
    url: '/items/new',
    icon: 'add_circle',
    label: 'Add Item',
    button: true,
  },
]

const logoClickHandler = () => $goto('/')
</script>

<Drawer miniMenu modal hideForPhonesOnly {toggle} {menuItems} title='Covered' class="auto-width border-white">
  <span class="pointer" on:click={logoClickHandler} slot="header">
    <img class="w-100" src="/logo.svg" alt="Cover">
  </span>

  <AppHeader on:toggleDrawer={() => toggle = !toggle} />

  <slot />

  <AppFooter />
  
</Drawer>
