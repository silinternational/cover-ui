<script>
import { Banner } from '../../components'
</script>

<style>
i.material-icons {
  margin-right: 0.5rem;
}
.error-color {
  color: var(--mdc-theme-status-error);
}
</style>

<Banner background="var(--mdc-theme-status-error-bg)"
        color="var(--mdc-theme-status-error)">
  <i class="material-icons mdc-list-item__graphic error-color" aria-hidden="true">error</i>
  <slot />
</Banner>
