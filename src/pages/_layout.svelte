<script lang="ts">
import user, { isUserSteward } from '../authn/user'
import { AppDrawer } from 'components'
import { initialized as policiesInitialized, loadPolicies, policies } from 'data/policies'
import * as routes from 'helpers/routes'
import { goto } from '@roxi/routify'

$: $policiesInitialized || loadPolicies()

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
    hide: !isUserSteward($user),
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

const goToPolicyAsCustomer = (event: CustomEvent) => $goto(routes.policyHome(event.detail))
const goToRoleHome = (event: CustomEvent) => $goto(routes.adminRoleHome(event.detail))
</script>

<AppDrawer {menuItems} policies={$policies} on:policy={goToPolicyAsCustomer} on:role={goToRoleHome}>
  <slot />
</AppDrawer>
