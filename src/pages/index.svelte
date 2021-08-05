<script>
import { loadUser } from '../data/user'
import { goto } from '@roxi/routify'
import { onMount } from 'svelte'

onMount(async () => {
  loadUser().then(() => {
    $goto('/home')
  }).catch(error => {
    if (error.code === 401) {
      $goto('/login')
    }
  })
})
</script>
