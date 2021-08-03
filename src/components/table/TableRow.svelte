<script>
    export let values
    export let border = "none"
</script>

<style>
    .table-row {
        border: none;
        text-align: left;
    }

    td {
        border: none;
    }
</style>

<!--TODO: add tranisition-->
<tr style="{border != "none" ? border: ""}" class="table-row">
    {#each values as v}
        <td>{v}</td>
    {/each}
    <slot />
</tr>