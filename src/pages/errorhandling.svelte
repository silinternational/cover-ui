<script>
import { GET } from '../data'
import { throwError, dismiss } from '../error'
import { route } from '@roxi/routify'

const tests = {
  client: [
    {
      info: 'run-time, e.g., call a func that does not exist.',
      test: () => window.whatIsTheAirspeedVelocityOfAnUnladenSwallow(),
    },
    {
      info: 'bad connection to backend',
      test: async () => await GET('//httpbin'),
    },
    {
      info: 'form validation',
      test: () => throwError('sorry, that password has been pwned...please try another'),
    },
    {
      info: 'unhandled in <code>{#await ...}</code>',
      test: () => runAwaitTest = true,
    },
  ],
  backend: [
    {
      type: 'backend',
      info: 'non-200 response from backend',
      test: async () => await GET('status/500'),
    },
  ]
}

const filterTestsType = type => tests.filter(test => test.type === type)

let runAwaitTest = false

$: $route && dismiss()
</script>

<style>
ul {
  padding-inline-start: 0;
}
li {
  list-style-type: none;
}
button {
  color: darkred;
}
</style>
{#each Object.keys(tests) as type}
  <h1>{type}</h1>
  <ul>
    {#each tests[type] as {info, test}}
      <li>{@html info} <button on:click={test} title="generate error">▶︎</button></li>
    {/each}
  </ul>
{/each}

{#if runAwaitTest}
  {#await GET('status/500')}
    Ensures `unhandledrejection` is handled consistently, even inside `#await`
  {/await}
{/if}
