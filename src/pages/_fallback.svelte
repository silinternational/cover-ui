<script lang="ts">
import { notFound } from '../analytics'
import { onMount } from 'svelte'
import { formatPageTitle } from 'helpers/pageTitle'
import { HOME } from 'helpers/routes'
import { metatags } from '@roxi/routify'
import { Page } from '@silintl/ui-components'

onMount(notFound)
metatags.title = formatPageTitle('Page Not Found')
</script>

<style>
p {
  text-align: center;
}
</style>

<Page>
  <p>
    Sorry, this page doesn't exist.
    <a class="mdc-theme--primary" href={HOME}>Go home</a>
  </p>
</Page>
