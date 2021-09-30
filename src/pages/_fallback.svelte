<script lang="ts">
import { notFound } from '../analytics'
import { Row } from '../components'
import { Page } from '@silintl/ui-components'
import { onMount } from 'svelte'

onMount(notFound)
</script>

<style>
p {
  text-align: center;
}
.typography-button-font-weight {
  font-weight: var(--mdc-typography-button-font-weight);
}
</style>

<Page>
  <div class="typography-button-font-weight">
    <Row>
      <p>These aren't the droids you're looking for... 🤖</p>
    </Row>
  </div>
</Page>
