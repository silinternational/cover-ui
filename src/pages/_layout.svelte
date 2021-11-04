<script lang="ts">
import user, { isAdmin, UserAppRole } from '../authn/user'
import { AppDrawer } from 'components'
import { initialized as policiesInitialized, loadPolicies, policies, Policy } from 'data/policies'
import * as routes from 'helpers/routes'
import { goto } from '@roxi/routify'
import { roleSelection, selectedPolicyId } from 'data/role-policy-selection'

$: $policiesInitialized || loadPolicies()

$: myPolicies = $user?.policies || []
$: policyId = $selectedPolicyId || $user.policy_id
$: inAdminRole = isAdmin($user) && ($roleSelection === UserAppRole.Steward || $roleSelection === UserAppRole.Signator)

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
    url: inAdminRole ? routes.ADMIN_HOME : routes.customerClaims(policyId),
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
    url: routes.settingsPolicy(policyId),
    icon: 'settings',
    label: 'Settings',
    tooltip: 'Group Settings',
  },
  {
    url: routes.itemsNew(policyId),
    icon: 'add_circle',
    label: 'Add Item',
    button: true,
    hide: inAdminRole,
  },
]

const goToPolicyAsCustomer = (event: CustomEvent) => $goto(routes.policyHome(event.detail))
const goToAdminHome = () => $goto(routes.ADMIN_HOME)
</script>

<AppDrawer {menuItems} {myPolicies} role={$user.app_role} on:policy={goToPolicyAsCustomer} on:role={goToAdminHome}>
  <slot />
</AppDrawer>
