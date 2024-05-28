<script lang="ts">
import user, { UserAppRole, getDefaultPolicyId, isAdmin, isCustomer } from 'data/user'
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
$: customerIsOnAdminView = ($route as any).path.includes('admin') && isCustomer($user.app_role)
$: userNotAdmin = !inAdminRole || userIsAnonymous

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
    hide: userNotAdmin,
  },
  {
    url: routes.REPORTS,
    icon: 'summarize',
    label: 'Reports',
    hide: userNotAdmin,
  },
  {
    url: routes.ENTITIES,
    icon: 'domain',
    label: 'Entities',
    hide: userNotAdmin,
  },
  {
    url: routes.AUDITS,
    icon: 'sync_problem',
    label: 'Audits',
    hide: userNotAdmin,
  },
  {
    url: routes.RENEWALS,
    icon: 'refresh',
    label: 'Renewals',
    hide: userNotAdmin,
  },
  // Non admin menu items
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

const goToCustomerView = (event: CustomEvent) => {
  if (isCustomerOnOwnPolicy(event.detail)) {
    return
  } else {
    $goto(routes.policyDetails(event.detail))
  }
}
const goToAdminView = (e: CustomEvent) => {
  const role: UserAppRole = e.detail
  if ($params.policyId) {
    return
  } else if (isAdmin(role)) {
    $goto(routes.ADMIN_HOME)
  }
}
</script>

<AppDrawer
  {menuItems}
  {myPolicies}
  role={$user.app_role}
  {userIsAnonymous}
  on:policy={goToCustomerView}
  on:role={goToAdminView}
>
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
