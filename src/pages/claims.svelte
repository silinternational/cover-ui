<script>
  import { ClaimCards, Row } from '../components/'
  import { Page, Button } from '@silintl/ui-components'
  
  const exampleItems = [
    {
      name: "Saxophone",
      accountable_person: "John Russel",
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
    {
      name: "GoPro",
      accountable_person: "Priscilla Russel",
      last_changed: "5 days",
      state: { icon: 'chat' }
    },
  ]
  </script>
  
  <Page layout="grid">
    <Row cols={'12'}>
      <Button raised url="/claims/newClaim">New claim</Button>
    </Row>

    <Row cols={'12'}>
      <ClaimCards {exampleItems} />
    </Row>
  </Page>
