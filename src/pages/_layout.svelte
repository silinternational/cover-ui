<script lang="ts">
import user, { isSteward } from '../authn/user'
import { AppDrawer } from 'components'
import { initialized as policiesInitialized, loadPolicies, policies } from 'data/policies'
import * as routes from 'helpers/routes'
import { goto } from '@roxi/routify'

$: $policiesInitialized || loadPolicies()

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
    hide: !isSteward($user),
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

const goToPolicyAsCustomer = (event: CustomEvent) => $goto(`/customer/home/${event.detail}`)
const goToRoleHome = (event: CustomEvent) => $goto(`/${event.detail}/home`)
</script>

<AppDrawer {menuItems} policies={$policies} on:policy={goToPolicyAsCustomer} on:role={goToRoleHome}>
  <slot />
</AppDrawer>
