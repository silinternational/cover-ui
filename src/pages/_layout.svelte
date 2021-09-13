<script lang="ts">
import AppFooter from '../components/AppFooter.svelte'
import AppHeader from '../components/AppHeader.svelte'
import { goto } from '@roxi/routify'
import { Drawer } from '@silintl/ui-components'

let toggle = false

$: menuItems = [
  {},
  {
    url: '/home',
    icon: 'house',
    label: 'Home',
  },
  {
    url: '/claims',
    icon: 'label',
    label: 'Claims',
  },
  {
    url: '/faq',
    icon: 'article',
    label: 'FAQ',
  },
  // {
  //   url: '/chat',
  //   icon: 'chat',
  //   label: 'Chat',
  // },
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