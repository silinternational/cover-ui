<script>
import AppFooter from '../components/AppFooter.svelte'
import AppHeader from '../components/AppHeader.svelte'
import { goto } from '@roxi/routify'
import { Drawer } from '@silintl/ui-components'

let isFullHeightMenu = false
let hasTopAppBar = false

$: menuItems = [
  {},
  {
    url: '/',
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
    url: '/item',
    icon: 'add_circle',
    label: 'Add Item',
    button: true,
  },
]

const logoClickHandler = () => $goto('/home')
</script>

<Drawer modal {hasTopAppBar} {menuItems} title='Covered' {isFullHeightMenu} class="auto-width border-white">
  <span class="pointer" on:click={logoClickHandler} slot="header">
    <img class="w-100" src="/logo.svg" alt="Cover">
  </span>

  <AppHeader />

  <main>  
    <slot />
  </main>

  <AppFooter />
  
</Drawer>