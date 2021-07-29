<script>
import { GET, UPDATE, CREATE, DELETE, upload } from '../data'

const dummyData = {
  abc: 123,
}

let src = ''
let alt = ''

async function uploaded(event) {
  const formData = new FormData()
  formData.append('file', event.target.files[0])

  const { files } = await upload(formData)

  src = files.file
  alt = event.target.files[0].name
}
</script>

<style>
div {
  max-width: 70vw;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
}
section {
  border: solid lightgrey 1px;
  border-radius: 0.5rem;

  margin-top: 2rem;
  margin-right: 1rem;
  padding: 0 1rem 1rem;
}
section > h1 {
  margin-top: 1rem;
}
img {
  max-height: 6rem;
}
</style>

<div>
  <section>
    <h1>GET</h1>
    {#await GET('uuid') then response}
      <pre>{response.uuid}</pre>
    {/await}
  </section>

  <section>
    <h1>PUT</h1>
    {#await UPDATE('delay/2', dummyData)}
      ⏳
    {:then response}
      ✅ <code>{response.data}</code>
    {/await}
  </section>

  <section>
    <h1>POST</h1>
    {#await CREATE('post', dummyData)}
      ⏳
    {:then response}
      <code>{response.data}</code>
    {/await}
  </section>

  <section>
    <h1>DELETE</h1>
    {#await DELETE('delete') then response}
      ✅
    {/await}
  </section>

  <section>
    <h1>file upload</h1>
    <input type="file" accept="image/*" on:change={uploaded} />
    
    {#if src}
      <img {src} {alt}>
    {/if}
  </section>
</div>
