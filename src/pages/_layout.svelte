<script lang="ts">
import user, { isUserSteward } from '../authn/user'
import { AppDrawer } from 'components'
import { initialized as policiesInitialized, loadPolicies, policies, Policy } from 'data/policies'
import { PolicyMember } from 'data/policy-members'
import * as routes from 'helpers/routes'
import { goto, params } from '@roxi/routify'

$: $policiesInitialized || loadPolicies()

let myPolicies: Policy[] = []

$: myHouseholdPolicyId = $user.policy_id
$: if ($user.id) {
  myPolicies = $policies.filter(hasMeAsMember)
}

$: selectedPolicyId = $params.policyId

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
    url: routes.customerClaims(myHouseholdPolicyId),
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
    url: routes.itemsNew(myHouseholdPolicyId),
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

<AppDrawer
  {menuItems}
  {myPolicies}
  {selectedPolicyId}
  role={$user.app_role}
  on:policy={goToPolicyAsCustomer}
  on:role={goToRoleHome}
>
  <slot />
</AppDrawer>
