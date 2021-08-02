<script>
    let urls = []
    let href = window.location.href.replace("https://", "").replace("http://", "").split("/")

    while (href.length > 1) {
        let name = href[href.length - 1].toLowerCase()
        urls.unshift({url: href.join("/"), name: capitalize(name) })

        href.pop()
    }

    function capitalize(string) {
        return string.replace(/^\w/, (c) => c.toUpperCase());
    }
</script>

<!--TODO: change the '>' with the actual icon-->
{#each urls as val, i}
    <a href="https://{val.url}" style="margin: 0 3px;">{val.name}</a><!--
    -->{#if (urls.length - 1) != i}
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16" style="font-size: 1.5rem">
            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
    {/if}
{/each}