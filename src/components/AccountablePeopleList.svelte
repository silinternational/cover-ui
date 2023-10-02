<script lang="ts">
import type { PolicyDependent } from 'data/dependents'
import type { PolicyMember } from 'data/types/policy-members'
import { IconButton, Tooltip } from '@silintl/ui-components'
import { createEventDispatcher } from 'svelte'

export let policyMembers: PolicyMember[] = []
export let dependents: PolicyDependent[] = []
export let isHouseholdPolicy = false
export let userID: string

$: isYou = (member: PolicyMember) => userID === member.id

const dispatch = createEventDispatcher<{
  deleteMember: PolicyMember
  editDependent: PolicyDependent
  editProfile: void
}>()

const editProfile = () => dispatch('editProfile')

const editDependent = (dependent: PolicyDependent) => {
  dispatch('editDependent', dependent)
}
</script>

<style>
.accountable-people-list {
  counter-reset: item;
  list-style-type: none;
  padding-left: 0;
  margin: 10px 0;
}

.accountable-people-list-item {
  display: flex;
  justify-content: space-between;
  border: 0 solid rgba(0, 0, 0, 0.12);
  border-top-width: 1px;
  padding: 10px;
  position: relative;
}

.accountable-people-list-item:last-of-type {
  border-bottom-width: 1px;
}
.edit-button {
  top: 0.25rem;
  color: rgba(0, 0, 0, 0.5);
  padding-right: 2rem;
}
</style>

<header>
  <span class="header">Accountable people</span>
</header>
<ul class="accountable-people-list">
  {#each policyMembers as policyMember}
    <li class="accountable-people-list-item">
      <span>
        {policyMember.first_name || ''}
        {policyMember.last_name || ''}
        {isYou(policyMember) ? '(you)' : ''}
        <br />
        <small>{policyMember.email || ''}</small>
        <br />
        <small>{policyMember.country || ''}</small>
      </span>
      <span class="edit-button">
        {#if isYou(policyMember)}
          <Tooltip.Wrapper ariaDescribedBy="edit-profile-button">
            <IconButton icon="person" ariaLabel="Edit your profile" on:click={editProfile} />
          </Tooltip.Wrapper>

          <Tooltip tooltipID="edit-profile-button" positionX="start">Edit your profile</Tooltip>
        {:else}
          <IconButton
            icon="delete"
            ariaLabel="Delete"
            on:click={() => {
              dispatch('deleteMember', policyMember)
            }}
          />
        {/if}
      </span>
    </li>
  {/each}
  {#each dependents as dependent}
    <li class="accountable-people-list-item">
      <span>
        {dependent.name || ''}
        {#if isHouseholdPolicy}
          <br />
          <small>Dependent ({dependent.relationship || '-'})</small>
        {/if}
        <br />
        <small>{dependent.country || ''}</small>
      </span>
      <span class="edit-button">
        <Tooltip.Wrapper ariaDescribedBy={'edit-person-' + dependent.id}>
          <IconButton icon="edit" ariaLabel="Edit" on:click={() => editDependent(dependent)} />
        </Tooltip.Wrapper>

        <Tooltip tooltipID={'edit-person-' + dependent.id} positionX="end">Edit dependent</Tooltip>
      </span>
    </li>
  {/each}
</ul>
