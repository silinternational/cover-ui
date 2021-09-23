<script lang="ts">
import { error, dismiss } from '../error'
import { isChangingPage } from '@roxi/routify'
import { afterUpdate } from 'svelte'

let errContainer: HTMLSpanElement

$: errContainer && scrollIntoView(errContainer)
$: $isChangingPage && $error.message && dismiss()
$: errorMessage = $error.message || $error.statusText

const scrollIntoView = (element: HTMLElement) => element.scrollIntoView({ behavior: 'smooth' })

afterUpdate(() => {
  if (errContainer) {
    scrollIntoView(errContainer)
  }
})
</script>

<style>
span {
  background-color: darkred;
  color: whitesmoke;
  border-radius: 0.25rem;
  padding: 1rem;
}
span small {
  position: relative;
  top: -1rem;
  right: -0.5rem;
  cursor: pointer;
}
</style>

{#if errorMessage}
  <span bind:this={errContainer}>
    {errorMessage} <small on:click={dismiss}>⨉</small>
  </span>
{/if}
