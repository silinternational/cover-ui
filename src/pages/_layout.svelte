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
    {
      url: '/chat',
      icon: 'chat',
      label: 'Chat',
    },
    {
      url: '/item',
      icon: 'add_circle',
      label: 'Add Item'
    },
  ]

  const logoClickHandler = () => $goto('/home')
</script>

<Drawer modal {menuItems} title='Riskman' class="auto-width">
  <span class="pointer" on:click={logoClickHandler} slot="header">
    <img class="w-100" src="/logo.png" alt="logo">
  </span>
  
  <AppHeader />

  <main>  
    <slot />
  </main>

  <AppFooter />
  
</Drawer>