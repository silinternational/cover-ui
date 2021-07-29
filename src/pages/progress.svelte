<script>
import { start, stop } from '../components/progress'
import { GET } from '../data'

const buildRandomCallDb = numCalls => {
  const db = []

  for (let i = 0; i < numCalls; i++) {
    const seconds = Math.floor(Math.random() * 10) + 1
    
    const call = seconds < 8 ? `delay/${seconds}` : 'status/500'
    
    db.push(call)
  }

  db.push('//httpbin')

  return db
}

const on = () => start('manual')
const off = () => stop('manual')
</script>

<style>
ul {
  padding-inline-start: 0;
}
li {
  list-style-type: none;
}
.truncate {
  display: inline-block;
  max-width: 10rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<h1>backend</h1>
<ul>
  {#each buildRandomCallDb(7) as call}
    <li>
      <code>{call}</code>
      {#await GET(call)}
        ⏳
      {:then data}
        ✅ <code><small class="truncate">{JSON.stringify(data)}</small></code>
      {:catch error}
        🔥 <code><small>{error.message || error}</small></code>
      {/await}
    </li>
  {/each}
</ul>

<h1>manual</h1>
<button on:click={on}>on</button>
<button on:click={off}>off</button>
