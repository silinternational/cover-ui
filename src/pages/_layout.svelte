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
      label: 'policies',
    },
    {
      url: '/claims',
      icon: 'label',
      label: 'claims',
    },
    {
      url: '/faq',
      icon: 'article',
      label: 'faq',
    },
    {
      url: '/chat',
      icon: 'chat',
      label: 'chat',
    },
    {
      url: '/item',
      icon: 'add_circle',
      label: ''
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