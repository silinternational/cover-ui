<script>
import AppFooter from '../components/AppFooter.svelte'
import AppHeader from '../components/AppHeader.svelte'

</script>

<style>
:global(body) {
  display: flex;
  flex-direction: column;
  align-items: center;
}

main {
  flex: 1 0 auto;
}
</style>

<AppHeader />

<main>  
  <slot />
</main>

<AppFooter />


