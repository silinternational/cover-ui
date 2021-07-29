<script>
import '../components/typography.scss'
</script>

<style lang="scss">
@import '../components/button';
$tuesdayTie: cornflowerblue;

button {
  @include sassy;
}
.fight-club {
  background-color: $tuesdayTie;
}
button > code {
  text-transform: initial;
}
</style>

<h3><code>sass</code>-y h3</h3>

<button>
  <code>sass</code>-y button
</button>
<button class="fight-club">
  <code>sass</code>-y button
</button>