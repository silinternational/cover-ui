<script lang="ts">
import user, { isUserSteward } from '../authn/user'
import { AppDrawer } from 'components'
import * as routes from 'helpers/routes'

$: menuItems = [
  {},
  {
    url: routes.HOME,
    icon: 'home',
    label: 'Home',
  },
  {
    url: routes.POLICIES,
    icon: 'description',
    label: 'Policies',
    hide: !isUserSteward($user),
  },
  {
    url: routes.CUSTOMER_CLAIMS,
    icon: 'label',
    label: 'Claims',
  },
  {
    url: routes.FAQ,
    icon: 'quiz',
    label: 'FAQ',
  },
  // {
  //   url: routes.CHAT,
  //   icon: 'chat',
  //   label: 'Chat',
  // },
  {
    url: routes.SETTINGS_HOUSEHOLD,
    icon: 'settings',
    label: 'Settings',
    tooltip: 'Group Settings',
  },
  {
    url: routes.ITEMS_NEW,
    icon: 'add_circle',
    label: 'Add Item',
    button: true,
  },
]
</script>

<AppDrawer {menuItems}>
  <slot />
</AppDrawer>
