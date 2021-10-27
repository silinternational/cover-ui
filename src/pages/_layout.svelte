<script lang="ts">
import user, { isUserSteward } from '../authn/user'
import { AppDrawer } from 'components'
import { loading } from 'components/progress'
import { initialized as policiesInitialized, loadPolicies, policies, Policy } from 'data/policies'
import { loadMembersOfPolicy, membersByPolicyId, PolicyMember } from 'data/policy-members'
import * as routes from 'helpers/routes'
import { goto, params } from '@roxi/routify'

$: $policiesInitialized || loadPolicies()

let myPolicies: Policy[] = []

$: myHouseholdPolicyId = $user.policy_id
$: if ($user.id) {
  myPolicies = getMyPolicies($policies, $membersByPolicyId, $loading)
}

$: selectedPolicyId = $params.policyId

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

const haveLoadedMembersForPolicyId = (policyId: string, membersByPolicyId) => Array.isArray(membersByPolicyId[policyId])
const getMyPolicies = (policies: Policy[], membersByPolicyId, loading) => {
  if (!loading) {
    policies.forEach((policy) => {
      if (!haveLoadedMembersForPolicyId(policy.id, membersByPolicyId)) {
        loadMembersOfPolicy(policy.id)
      }
    })
  }

  return policies.filter(hasMeAsMember)
}
const goToPolicyAsCustomer = (event: CustomEvent) => $goto(routes.policyHome(event.detail))
const goToRoleHome = (event: CustomEvent) => $goto(routes.adminRoleHome(event.detail))
const hasMeAsMember = (policy: Policy) => {
  const members = $membersByPolicyId[policy.id] || []
  return members.some(isPolicyMemberMe)
}
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
