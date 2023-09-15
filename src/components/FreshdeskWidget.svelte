<script lang="ts">
import user, { User } from 'data/user'
import { onMount } from 'svelte'

onMount(() => {
  // Here be dragons
  window.fwSettings = { widget_id: Number(process.env.FRESHDESK_ID) }
  // @ts-ignore
  // prettier-ignore
  !function(){if("function"!=typeof window.FreshworksWidget){var n=function(){n.q.push(arguments)};n.q=[],window.FreshworksWidget=n}}()
})

$: setUserData($user)

const setUserData = (user: User) => {
  if (user && typeof FreshworksWidget !== 'undefined') {
    FreshworksWidget('identify', 'ticketForm', {
      name: user?.first_name,
      email: user?.email_override || user?.email,
    })
  }
}
</script>

<svelte:head>
  <script
    type="text/javascript"
    src="https://widget.freshworks.com/widgets/{process.env.FRESHDESK_ID}.js"
    async
    defer
  ></script>
</svelte:head>
