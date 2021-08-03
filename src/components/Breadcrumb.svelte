<script>
import { goto, url } from "@roxi/routify";

export let links

let urls = []
if (!links) {
  let href = $url().replace("https://", "").replace("http://", "").split("/")

  while (href.length > 1) {
    let name = href[href.length - 1].toLowerCase()
    urls.unshift({ url: href.join("/"), name: name })

    href.pop()
  }
} else {
  links.forEach((val, i) => {
    let name = val.split("/")[val.split("/").length - 1]

    urls.push({ url: val, name: name })
  })
}

</script>

<style>
.breadcrumb-arrow {
  margin: 0 3px;
}
</style>

<!--TODO: change the '>' with the actual icon-->
{#each urls as val, i}
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a on:click={() => $goto(val.url)} href="" class="capitalize">{val.name}</a><!--
  -->{#if (urls.length - 1) != i}
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-chevron-right breadcrumb-arrow" viewBox="0 0 16 16" style="font-size: 1.5rem">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  {/if}
{/each}