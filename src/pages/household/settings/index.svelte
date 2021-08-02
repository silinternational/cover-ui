<script>
    import Breadcrumb from "../../../components/Breadcrumb.svelte"
    import { Page, List } from "@silintl/ui-components"

    // TODO: make this dependent on backend
    let members = [
        {
            name: "Levi Wenger",
            isYou: true,
            isDependent: false,
            email: "levi_wenger@sil.org",
        },
        {
            name: "Cameron Gordon",
            isYou: false,
            isDependent: true,
        }
    ]
</script>

<style>
    #members-div {
        margin: 30px;
    }
</style>

<Page>
    <Breadcrumb />
    <br />
    <div id="members-div">

    </div>
    <strong>Members</strong>
    <List>
        {#each members as m}
            <List.Divider />
            <List.Item on:click={() => console.log(`You clicked on ${m.name}`)}>
                {m.name} {m.isYou ? "(you)" : ""}
                <br />
                <small>{m.isDependent ? "Dependent" : m.email}</small>
            </List.Item>
        {/each}
        <List.Divider />
    </List>
</Page>