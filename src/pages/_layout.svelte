<script lang="ts">
import user, { isSteward } from '../authn/user'
import { AppDrawer } from 'components'
import * as routes from 'helpers/routes'

$: policyId = $user.policy_id

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
    url: routes.customerClaims(policyId),
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
    url: routes.itemsNew(policyId),
    icon: 'add_circle',
    label: 'Add Item',
    button: true,
  },
]
</script>

<AppDrawer {menuItems}>
  <slot />
</AppDrawer>
