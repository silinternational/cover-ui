<script lang="ts">
import user, { getDefaultPolicyId, isAdmin } from '../authn/user'
import { AppDrawer } from 'components'
import { initialized as policiesInitialized, loadPolicies } from 'data/policies'
import { roleSelection, selectedPolicyId } from 'data/role-policy-selection'
import * as routes from 'helpers/routes'
import { goto, params, route } from '@roxi/routify'

// polcies were not being loaded on initial login, once selectedPolicyId exists they load properly
$: $policiesInitialized || ($user.policies.length > 0 && loadPolicies())

$: myPolicies = $user?.policies || []
$: policyId = $selectedPolicyId || getDefaultPolicyId($user)
$: inAdminRole = isAdmin($roleSelection)
$: urlIsClaimOrItem = $params.claimId || $params.itemId

// TODO: Update this based on the user's role and/or the RoleAndPolicyMenu selection.
$: menuItems = [
  {},
  {
    url: routes.HOME,
    urlPattern: /\/home$/,
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
    url: routes.policyDetails(policyId),
    icon: 'description',
    label: 'Policy Details',
    hide: inAdminRole,
  },
  {
    url: routes.ITEMS,
    urlPattern: /(\/items$)|(\/items\/)/,
    icon: 'umbrella',
    label: 'Items',
    hide: inAdminRole,
  },
  {
    url: routes.customerClaims(policyId),
    urlPattern: /(\/claims$)|(\/claims\/)/,
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
    urlPattern: /(\/settings$)|(\/settings\/)/,
    icon: 'settings',
    label: 'Policy Settings',
    tooltip: 'Policy Settings',
    hide: inAdminRole,
  },
  {
    url: routes.itemsNew(policyId),
    icon: 'add_circle',
    label: 'Add Item',
    button: true,
    hide: inAdminRole || !policyId,
  },
]
const isCustomerOnOwnPolicy = (policyId: string) => policyId === $selectedPolicyId

const gotoPath = (policyId: string, claimOrItemIdObj = {}) => $goto($route.path, { policyId, ...claimOrItemIdObj })

const goToCustomerView = (event: CustomEvent) => {
  if (!urlIsClaimOrItem && $params.policyId) {
    gotoPath(event.detail)
  } else if (urlIsClaimOrItem && isCustomerOnOwnPolicy(event.detail)) {
    const claimOrItemIdObj = $params.claimId ? { claimId: $params.claimId } : { itemId: $params.itemId }
    gotoPath(event.detail, claimOrItemIdObj)
  } else {
    $goto(routes.policyHome(event.detail))
  }
}
const goToAdminView = (event: CustomEvent) => {
  if ($params.policyId) {
    const parameters: any = $params.claimId
      ? { claimId: $params.claimId }
      : $params.itemId
      ? { itemId: $params.itemId }
      : {}
    gotoPath($selectedPolicyId, parameters)
  } else {
    $goto(routes.ADMIN_HOME)
  }
}
</script>

<AppDrawer {menuItems} {myPolicies} role={$user.app_role} on:policy={goToCustomerView} on:role={goToAdminView}>
  <slot />
</AppDrawer>
