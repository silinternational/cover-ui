<script>
import { Banner } from '../../components'
</script>

<style>
i.material-icons {
  margin-right: 0.5rem;
}
.success-color {
  color: var(--mdc-theme-status-success);
}
</style>

<Banner background="var(--mdc-theme-status-success-bg)"
        color="var(--mdc-theme-status-success)">
  <i class="material-icons mdc-list-item__graphic success-color" aria-hidden="true">check_circle</i>
  <slot />
</Banner>
