<script lang="ts">
import { notFound } from '../analytics'
import { onMount } from 'svelte'
import { formatPageTitle } from 'helpers/pageTitle'
import { metatags } from '@roxi/routify'

onMount(notFound)
metatags.title = formatPageTitle('Page Not Found')
</script>

<style>
p {
  text-align: center;
}
</style>

<p>These aren't the droids you're looking for... 🤖</p>
