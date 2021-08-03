<script>
import AppFooter from '../components/AppFooter.svelte'
import AppHeader from '../components/AppHeader.svelte'
import { goto } from '@roxi/routify'
import { Drawer } from '@silintl/ui-components'

$: menuItems = [
  {},
  {
    url: '/policies',
    icon: 'house',
    label: 'Policies',
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

<Drawer modal {menuItems} title='Riskman' isFullHeightMenu={false} class="auto-width">
  <span class="pointer" on:click={logoClickHandler} slot="header">
    <img class="w-100" src="/logo.svg" alt="Cover">
  </span>
  
  <AppHeader />

  <main>  
    <slot />
  </main>

  <AppFooter />
  
</Drawer>