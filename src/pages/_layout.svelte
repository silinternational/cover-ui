<script lang="ts">
import user, { AdminAppRole, isAdmin } from '../authn/user'
import { AppDrawer } from 'components'
import { initialized as policiesInitialized, loadPolicies, policies, Policy } from 'data/policies'
import * as routes from 'helpers/routes'
import { goto } from '@roxi/routify'
import { roleSelection, selectedPolicyId } from 'data/role-policy-selection'

$: $policiesInitialized || loadPolicies()

$: myPolicies = $policies.filter((p) => p.members?.some((m) => m.id === $user.id))
$: policyId = $selectedPolicyId || $user.policy_id
$: inAdminRole = isAdmin($user) && ($roleSelection === 'Steward' || $roleSelection === 'Signator')

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
    url: inAdminRole ? routes.adminRoleHome($roleSelection as AdminAppRole) : routes.customerClaims(policyId),
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
const goToRoleHome = (event: CustomEvent) => $goto(routes.adminRoleHome(event.detail))
</script>

<AppDrawer {menuItems} {myPolicies} role={$user.app_role} on:policy={goToPolicyAsCustomer} on:role={goToRoleHome}>
  <slot />
</AppDrawer>
