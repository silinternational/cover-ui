<script lang="ts">
import user, { isAdmin } from '../authn/user'
import { AppDrawer } from 'components'
import { initialized as policiesInitialized, loadPolicies } from 'data/policies'
import * as routes from 'helpers/routes'
import { goto } from '@roxi/routify'
import { roleSelection, selectedPolicyId } from 'data/role-policy-selection'

// TODO: Avoid trying to load the policies until the user has authenticated (to
// avoid doing so on public pages, like the Privacy Policy).
$: $policiesInitialized || loadPolicies()

$: myPolicies = $user?.policies || []
$: policyId = $selectedPolicyId || $user.policy_id
$: inAdminRole = isAdmin($roleSelection)

// TODO: Update this based on the user's role and/or the RoleAndPolicyMenu selection.
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
    hide: !inAdminRole,
  },
  {
    url: routes.ITEMS,
    icon: 'umbrella',
    label: 'items',
    hide: inAdminRole,
  },
  {
    url: inAdminRole ? routes.ADMIN_HOME : routes.customerClaims(policyId),
    icon: 'label',
    label: 'Claims',
    hide: inAdminRole,
  },
  {
    url: routes.FAQ,
    icon: 'quiz',
    label: 'FAQ',
    hide: true,
  },
  // {
  //   url: routes.CHAT,
  //   icon: 'chat',
  //   label: 'Chat',
  // },
  {
    url: routes.settingsPolicy(policyId),
    icon: 'settings',
    label: 'Settings',
    tooltip: 'Policy Settings',
  },
  {
    url: routes.itemsNew(policyId),
    icon: 'add_circle',
    label: 'Add Item',
    button: true,
    hide: inAdminRole || !policyId,
  },
]

const goToPolicyAsCustomer = (event: CustomEvent) => $goto(routes.policyHome(event.detail))
const goToAdminHome = () => $goto(routes.ADMIN_HOME)
</script>

<AppDrawer {menuItems} {myPolicies} role={$user.app_role} on:policy={goToPolicyAsCustomer} on:role={goToAdminHome}>
  <slot />
</AppDrawer>
