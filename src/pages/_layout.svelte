<script lang="ts">
import user, { getDefaultPolicyId, isAdmin, isCustomer } from 'data/user'
import { AppDrawer } from 'components'
import { initialized as policiesInitialized, loadPolicies } from 'data/policies'
import { roleSelection, selectedPolicyId } from 'data/role-policy-selection'
import * as routes from 'helpers/routes'
import { goto, params, route } from '@roxi/routify'
import { Page } from '@silintl/ui-components'
import { afterUpdate } from 'svelte'

let userIsAnonymous: boolean

afterUpdate(() => {
  userIsAnonymous = !$user.id
})

// polcies were not being loaded on initial login, once selectedPolicyId exists they load properly
$: $policiesInitialized || ($user.policies?.length > 0 && loadPolicies())

$: myPolicies = $user?.policies || []
$: policyId = $selectedPolicyId || getDefaultPolicyId($user)
$: inAdminRole = isAdmin($roleSelection)
$: urlIsClaimOrItem = $params.claimId || $params.itemId
$: customerIsOnAdminView = $route.path.includes('admin') && isCustomer($user.app_role)

$: menuItems = [
  {},
  {
    url: routes.HOME,
    urlPattern: /\/home$/,
    icon: 'home',
    label: 'Home',
    hide: !inAdminRole,
  },
  {
    url: routes.POLICIES,
    icon: 'description',
    label: 'Policies',
    hide: !inAdminRole || userIsAnonymous,
  },
  {
    url: routes.REPORTS,
    icon: 'summarize',
    label: 'Reports',
    hide: !inAdminRole || userIsAnonymous,
  },
  {
    url: routes.policyDetails(policyId),
    icon: 'description',
    label: 'Policy',
    hide: inAdminRole || userIsAnonymous || !policyId,
  },
  {
    url: routes.ITEMS,
    urlPattern: /(\/items$)|(\/items\/)/,
    icon: 'beach_access',
    label: 'Items',
    hide: inAdminRole || userIsAnonymous || !policyId,
  },
  {
    url: routes.customerClaims(policyId),
    urlPattern: /(\/claims$)|(\/claims\/)/,
    icon: 'assignment',
    label: 'Claims',
    hide: inAdminRole || userIsAnonymous || !policyId,
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
    hide: inAdminRole || userIsAnonymous || !policyId,
  },
  {
    url: routes.itemsNew(policyId),
    icon: 'add_circle',
    label: 'Add Item',
    button: true,
    hide: inAdminRole || !policyId,
  },
  //Menu items for anonymous users
  {
    url: routes.ROOT,
    icon: 'person',
    label: 'Login',
    hide: !userIsAnonymous,
  },
  {
    url: routes.TERMS_OF_SERVICE,
    icon: 'article',
    label: 'Terms of Service',
    hide: !userIsAnonymous,
  },
  {
    url: routes.PRIVACY_POLICY,
    icon: 'policy',
    label: 'Privacy Policy',
    hide: !userIsAnonymous,
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
    $goto(routes.policyDetails(event.detail))
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
  {#if customerIsOnAdminView}
    <Page>
      <p class="m-0-auto">
        You are not authorized to view this page.
        <a class="mdc-theme--primary" href={routes.HOME}>Go home</a>
      </p>
    </Page>
  {:else}
    <slot />
  {/if}
</AppDrawer>
