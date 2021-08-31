<script>
import { createEventDispatcher } from "svelte"

export let options = {}
export let choice = ''

const dispatch = createEventDispatcher()

const chosen = () => {
  for (const [key, value] of Object.entries(options)){
    if(choice === value) {
      dispatch('chosen', key)
    }
  }
}
</script>

<style>
  /* datalist styling */
*, *::before, *::after {
  box-sizing: border-box;
}

.custom-field {
  font-size: 14px;
  position: relative;
  --field-padding: 12px;
  border-top: 20px solid transparent;
}

.custom-field input {
  border-radius: 8px;
  border: 1px solid gray;
  width: 240px;
  padding: var(--field-padding) 0 var(--field-padding) var(--field-padding);
}

.custom-field .placeholder {
  position: absolute;
  bottom: -45px;
  top: 22px;  
  transform: translateY(-50%);
  color: #aaa;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  left: var(--field-padding);
  width: calc(100% - (var(--field-padding) * 2));
  transition: 
    top 0.3s ease,
    color 0.3s ease,
    font-size 0.3s ease;
}

.custom-field input:not(:placeholder-shown) + .placeholder,
.custom-field input:focus + .placeholder {
  top: 4px;
  font-size: 10px;
  color: #222;
}
</style>

<label class="custom-field">
  <input class="fs-14" list="options" placeholder="&nbsp;" bind:value={choice} on:change={chosen}/>
  <span class="placeholder">Your entity of affiliation</span>
</label>

<datalist id="options">
  {#each Object.values(options) as option}
    <option value={option}>  
  {/each}
</datalist>