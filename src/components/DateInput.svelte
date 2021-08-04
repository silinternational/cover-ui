<script>

export let value = ''
export let disabled = false

</script>

<style>
.date-input {
    padding-right: 60px;
}
</style>

<!-- <input class="date-input" type="date" bind:value on:blur {disabled}/> -->

<label class="mdc-text-field mdc-text-field--outlined {$$props.class} textfield-radius"
       class:mdc-text-field--disabled={disabled}>
  <input type="date" class="mdc-text-field__input NotoSans date-input" bind:value on:blur {disabled}>
  <span class="mdc-notched-outline">
    <span class="mdc-notched-outline__leading"></span>
    <span class="mdc-notched-outline__trailing"></span>
  </span>
</label>