<script>
  import { ClaimCards } from '../components/'
  import { Page } from '@silintl/ui-components'
  
  const exampleItems = [
    {
      name: "Saxophone",
      accountable_person: "John Russel",
      last_changed: "5 days",
      sate: { icon: 'chat' }
    },
    {
      name: "GoPro",
      accountable_person: "Priscilla Russel",
      last_changed: "5 days",
      state: { icon: 'chat' }
    },
    {
      name: "GoPro",
      accountable_person: "Priscilla Russel",
      last_changed: "5 days",
      state: { icon: 'chat' }
    },
    {
      name: "GoPro",
      accountable_person: "Priscilla Russel",
      last_changed: "5 days",
      state: { icon: 'chat' }
    },
    {
      name: "GoPro",
      accountable_person: "Priscilla Russel",
      last_changed: "5 days",
      state: { icon: 'chat' }
    },
    {
      name: "GoPro",
      accountable_person: "Priscilla Russel",
      last_changed: "5 days",
      state: { icon: 'chat' }
    },
  ]
  </script>
  
  <Page layout="grid">   
    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
      <ClaimCards {exampleItems} />
    </div>
  </Page>