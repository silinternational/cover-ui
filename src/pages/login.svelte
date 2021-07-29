<script>
import { login } from '../authn'
import { getSeed } from '../authn/token'
</script>

<p>
  Simulate a <code>POST backend/login?client-id={getSeed()}</code> and it's <code>302</code> back to the app
  <button on:click={login}>login</button>
</p>
