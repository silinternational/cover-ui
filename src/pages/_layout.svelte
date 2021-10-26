<script lang="ts">
import user, { isUserSteward } from '../authn/user'
import { AppDrawer } from 'components'
import { initialized as policiesInitialized, loadPolicies, policies, Policy } from 'data/policies'
import { PolicyMember } from 'data/policy-members'
import * as routes from 'helpers/routes'
import { goto } from '@roxi/routify'

$: $policiesInitialized || loadPolicies()

let myPolicies: Policy[] = []

$: policyId = $user.policy_id
$: if ($user.id) {
  myPolicies = $policies.filter(hasMeAsMember)
}

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
const hasMeAsMember = (policy: Policy) => policy.members.some(isPolicyMemberMe)
const isPolicyMemberMe = (member: PolicyMember) => $user.id === member.id
</script>

<AppDrawer {menuItems} {myPolicies} on:policy={goToPolicyAsCustomer} on:role={goToRoleHome}>
  <slot />
</AppDrawer>
