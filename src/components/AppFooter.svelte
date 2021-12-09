<script lang="ts">
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from 'helpers/routes'
</script>

<style>
footer {
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: end;
}
a {
  padding-bottom: 2rem;
}
</style>

<footer>
  <a class="pr-1" href={TERMS_OF_SERVICE}>Terms of Service</a>
  <a href={PRIVACY_POLICY}>Privacy Policy</a>
</footer>
