<script lang="ts">
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from 'helpers/routes'

export let drawerIsFixed = true
</script>

<style>
footer {
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: end;
}
.margin-for-footer {
  margin-right: 256px;
}
a {
  padding-bottom: 2rem;
}
</style>

<footer class:margin-for-footer={drawerIsFixed}>
  <a class="pr-1" href={TERMS_OF_SERVICE}>Terms of Service</a>
  <a href={PRIVACY_POLICY}>Privacy Policy</a>
</footer>
