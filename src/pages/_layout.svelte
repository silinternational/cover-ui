<script lang="ts">
import user, { isSteward } from '../authn/user'
import { AppDrawer } from '../components/'

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
    url: '/customer/claims',
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
    label: 'Settings',
  },
  {
    url: '/items/new',
    icon: 'add_circle',
    label: 'Add Item',
    button: true,
  },
]
</script>

<AppDrawer {menuItems}>
  <slot />
</AppDrawer>
