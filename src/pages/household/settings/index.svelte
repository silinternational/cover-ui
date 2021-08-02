<script>
    import Breadcrumb from "../../../components/Breadcrumb.svelte"
    import { Page, List } from "@silintl/ui-components"
import { prevent_default } from "svelte/internal";

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

    .members-list:hover {
        background-color: white;
    }
</style>

<Page>
    <Breadcrumb />
    <br />
    <div id="members-div">

    </div>
    <strong>Members</strong>
    <!--TODO: replace this with custom List component (doesn't have hover and select animation)-->
    <List>
        {#each members as m}
            <List.Divider />
            <List.Item>
                {m.name} {m.isYou ? "(you)" : ""}
                <br />
                <small>{m.isDependent ? "Dependent" : m.email}</small>
            </List.Item>
        {/each}
        <List.Divider />
    </List>
</Page>