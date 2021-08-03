<script>
    import Breadcrumb from "../../../components/Breadcrumb.svelte"
    import { Page, List } from "@silintl/ui-components"
import { prevent_default } from "svelte/internal";

    // TODO: make this dependent on backend
    let members = [
        {
            name: "Alex Mercado",
            isYou: true,
            isDependent: false,
            email: "alex_mercado@sil.org",
        },
        {
            name: "Megan Mercado",
            isYou: false,
            isDependent: false,
            email: "megan_mercado@sil.org",
        },
        {
            name: "Pax Mercado",
            isYou: false,
            isDependent: true
        }
    ]
</script>

<style>
    #members-page {
        margin-top: 30px;
    }

    #members-list {
        counter-reset: item;
        list-style-type: none;
        padding-left: 0 !important;
    }

    .members-list-item {
        border: 0 solid rgba(0, 0, 0, 0.12);
        border-top-width: 1px !important;
        padding: 10px;
    }
</style>

<Page>
    <Breadcrumb />
    <br />

    <div id="members-page">
        <strong>Members</strong>

        <ul id="members-list">
            {#each members as m, i}
                <li class="members-list-item">
                    {m.name} {m.isYou ? "(you)" : ""}
                    <br />
                    <small>{m.isDependent ? "Dependent" : m.email}</small>
                </li>
                {#if i == (members.length - 1)}
                    <li class="members-list-item"></li>
                {/if}
            {/each}
        </ul>
    </div>
</Page>