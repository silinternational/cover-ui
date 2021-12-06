<script lang="ts">
import { COVER_EMAIL } from 'components/const'
import { COVER_EMAIL_HREF } from 'helpers/routes'
import { Page } from '@silintl/ui-components'
</script>

<style>
ol,
ul {
  line-height: 1.5;
}
table {
  border-collapse: collapse;
}
td {
  border: 1px solid rgba(0, 0, 0, 0.25);
  vertical-align: top;
}
td > p {
  margin: 1ex;
}
</style>

<Page>
  <h1>Cover Terms of Service</h1>
  <p>Effective December 1, 2021</p>
  <p>
    Thank you for using Cover! It is our pleasure to provide a bit of peace of mind to our staff around the globe.
    Please read this agreement carefully before using Cover to ensure you understand the scope of use and limits of
    liability for the Cover service.
  </p>
  <p>
    You may contact us at any time by emailing <a href={COVER_EMAIL_HREF}>{COVER_EMAIL}</a>.
  </p>

  <h2>Table of Contents</h2>
  <p><a href="#terms-and-definitions">Terms &amp; Definitions</a></p>
  <p><a href="#acceptable-use">Acceptable Use</a></p>
  <p><a href="#responsibilities-of-customers">Responsibilities of Customers</a></p>
  <p><a href="#responsibilities-of-cover-administrators">Responsibilities of Cover Administrators</a></p>
  <p><a href="#payment">Payment</a></p>
  <p><a href="#cancellation-and-termination">Cancellation and Termination</a></p>
  <p><a href="#limitations-of-coverage">Limitations of Coverage</a></p>
  <p><a href="#disclaimer-of-warranties">Disclaimer of Warranties</a></p>
  <p><a href="#limitation-of-liability">Limitation of Liability</a></p>
  <p><a href="#changes-to-these-terms-of-service">Changes to these Terms of Service</a></p>
  <p><a href="#severability">Severability</a></p>

  <h2 id="terms-and-definitions">Terms &amp; Definitions</h2>
  <table>
    <tbody>
      <tr>
        <td class="text-align-center"><p>Term</p></td>
        <td class="text-align-center"><p>Definition</p></td>
      </tr>
      <tr>
        <td><p>Account</p></td>
        <td>
          <p>
            Individuals create accounts with Cover by signing into the service using an authentication provider from
            their organization.
          </p>
        </td>
      </tr>
      <tr>
        <td><p>Administrators</p></td>
        <td>
          <p>
            Administrators of the Cover service are the people who approve items for coverage as well as claims for
            payment. All approved claims will be reviewed by at least two different administrators.
          </p>
        </td>
      </tr>
      <tr>
        <td><p>Agreement</p></td>
        <td>
          <p>
            The Agreement refers, collectively, to all the terms, conditions and notices contained or referenced in this
            document (the &quot;Terms of Service&quot; or the &quot;Terms&quot;) and all other operating rules, policies
            (including the Cover Privacy Statement, available at
            <a href="https://cover.sil.org/privacy">https://cover.sil.org/privacy</a>) and procedures that we may
            publish from time to time on the Cover website.
          </p>
        </td>
      </tr>
      <tr>
        <td><p>Claim</p></td>
        <td>
          <p>
            A request for a payout to remedy the loss or damage of a covered Item. Claims go through a process of
            providing necessary event information, evidence, and review by service Administrators before approval and
            payout.
          </p>
        </td>
      </tr>
      <tr>
        <td><p>Content</p></td>
        <td>
          <p>
            &quot;Content&quot; refers to content featured or displayed throughout the Website, including without
            limitation text, locations, images, photographs, and other materials that are available on Cover.
            &quot;User-Generated Content&quot; is Content, written or otherwise, created or uploaded by our Users.
            &quot;Your Content&quot; is User-Generated Content that you create or own.
          </p>
        </td>
      </tr>
      <tr>
        <td><p>Cover</p></td>
        <td>
          <p>
            &quot;Cover&quot;, &quot;We&quot;, &quot;Us&quot; refers to the service itself, as well as SIL
            International, the organization responsible for the service.
          </p>
        </td>
      </tr>
      <tr>
        <td><p>Coverage</p> </td>
        <td>
          <p>
            This Service covers sudden, accidental &amp; direct external physical loss of or damage to covered items,
            including loss or damage due to travel, shipping or theft, subject to the Service exclusions, deductibles,
            limits of coverage, and any other policy conditions. The coverage period is January 1 through December 31.
            Coverage will automatically renew unchanged unless you remove coverage for items you no longer want covered
            via the Cover Website.
          </p>
        </td>
      </tr>
      <tr>
        <td><p>Covered Value</p></td>
        <td>
          <p>Maximum value of a payout for an item (before deductible).</p>
          <p>
            It&rsquo;s capped at the cost of replacing the item new, and the customer has the option to manually reduce
            it over time to reflect depreciation. Premiums are calculated directly from the covered value.
          </p>
        </td>
      </tr>
      <tr>
        <td><p>Customer</p></td>
        <td><p>The individual, household, or team using the Cover service.</p></td>
      </tr>
      <tr>
        <td><p>Household Policy</p></td>
        <td>
          <p>
            A household policy is one that is intended to provide coverage for personal items belonging to an individual
            or family. Each Customer has exactly one household policy that may be also accessed and managed by their
            spouse (if their spouse is also a staff member). Household policies can include children as accountable
            persons for particular items, as well as for calculating overall coverage limits.
          </p>
          <p>
            A household policy premium is paid from the member&#39;s household account. More options may be made
            available in the future.
          </p>
        </td>
      </tr>
      <tr>
        <td><p>Item</p></td>
        <td><p>An individual item for which coverage is provided. A policy can have one or more items.</p></td>
      </tr>
      <tr>
        <td><p>Policy</p></td>
        <td>
          <p>
            A policy is the coverage for all of the items within a unit of risk, such as a household or team. Each
            individual customer has exactly one household policy, and he or she may be a member of one or more team
            policies.
          </p>
        </td>
      </tr>
      <tr>
        <td><p>Service</p></td>
        <td>
          <p>&quot;Service&quot; refers to the Cover website as well as the service of providing coverage for items.</p>
        </td>
      </tr>
      <tr>
        <td><p>Team Policy</p></td>
        <td>
          <p>
            A team policy is one that is intended to provide coverage for department/company owned assets. A team policy
            is managed by one or more staff members. A team policy can include multiple &quot;accountable persons&quot;
            for tracking who is responsible for a given item.
          </p>
          <p>
            A team policy premium is paid using standard procedures for finance entity, cost center, and account codes.
          </p>
        </td>
      </tr>
      <tr>
        <td><p>Website</p></td>
        <td><p>&quot;Website&quot; refers to the Cover website at https://cover.sil.org</p></td>
      </tr>
    </tbody>
  </table>
  <h2 id="acceptable-use">Acceptable Use</h2>
  <p>
    Background: Many of SIL&#39;s staff, as well as some partner organizations, take on a degree of risk with regard to
    their personal property in the process of serving in their jobs. To alleviate some of this burden, SIL operates an
    &quot;insurance-like&quot; service, known as Cover, to provide coverage for items in the event of theft, damage, and
    loss. The Service is primarily intended to provide coverage for items where coverage is otherwise not available. For
    example, a family living in a remote village in Cameroon likely does not have homeowner&rsquo;s or renter&rsquo;s
    insurance.
  </p>
  <p>
    However, the Service is available to all staff for supplemental coverage. Since it is common for the staff of
    organizations like SIL and its partners to have salaries below market rates, and since staff are not afforded the
    same protections given by other industries for travel and life abroad, Cover is available as a service to all staff
    and members.
  </p>
  <p>
    It should go without saying, but we&#39;ll say it here anyway: this service can only exist as long as Customers are
    honest and act with integrity. SIL is able to keep the premium rates low because, in our high trust and high
    integrity environment, we expect little to no fraudulent claims for coverage. So please exhibit the character and
    integrity expected of one who has accepted the Call. If fraud is suspected, your claim may be denied and coverage
    terminated.
  </p>
  <h2 id="responsibilities-of-customers">Responsibilities of Customers</h2>
  <ol start="1">
    <li>
      <b>Manage coverage</b>
      <p>
        Customers are responsible to manage coverage for their items using the Cover Website. This includes removing
        coverage from items no longer needing coverage and updating the primary locations of covered items or the people
        immediately responsible for such items.
      </p>
    </li>
    <li>
      <b>Care for items</b>
      <p>
        Customers are responsible to take care of their items, making a best effort to avoid the need to file claims.
      </p>
    </li>
    <li>
      <b>File claims within 90 days</b>
      <p>
        Customers are responsible to file claims within 90 days of an event of theft, damage, or loss. As a courtesy, we
        may extend that time limit for customers with limited internet access or who are experiencing exigent
        circumstances.
      </p>
    </li>
    <li>
      <b>Give evidence for claims and item values</b>
      <p>
        Customers are responsible to provide appropriate evidence and research to support claims. This includes
        obtaining multiple estimates for repair when possible as well as researching the current &quot;fair market
        value&quot; for an item in cases of repair or &quot;fair market value&quot; payout. It also includes ensuring
        replacements are comparable to the covered item.
      </p>
    </li>
    <li>
      <b>Get repair or replacement</b>
      <p>Customers are responsible for getting a covered item repaired or obtaining a replacement after approval.</p>
    </li>
  </ol>
  <h2 id="responsibilities-of-cover-administrators">Responsibilities of Cover Administrators</h2>
  <ol start="1">
    <li>
      <b>Decide coverage</b>
      <p>
        The Administrators are responsible to review and approve or deny coverage for items that are not eligible for
        auto-approval.
      </p>
    </li>
    <li>
      <b>Decide claims</b>
      <p>
        The Administrators are responsible to either pre-approve, request revisions, or deny claims before a Customer
        proceeds with paying for repairs or replacement.
      </p>
    </li>
    <li>
      <b>Review evidence</b>
      <p>
        The Administrators are responsible to review evidence provided by the Customer for specific cases and either
        approve, request revisions, or deny claims.
      </p>
    </li>
    <li>
      <b>Get second approval to finalize claims</b>
      <p>
        A different Administrator (normally, the &ldquo;Signator&rdquo;) is responsible to give final approval on claims
        for payout.
      </p>
    </li>
  </ol>
  <h2 id="payment">Payment</h2>
  <p>
    Policies auto-renew every year, starting January 1. Policies are paid through the internal accounting of SIL and its
    Wycliffe Global Alliance partners.
  </p>
  <ul>
    <li>
      <p>
        Household policies are paid for through the staff member&#39;s household account. In the future, more payment
        options, such as credit cards and PayPal, are planned for Household policies.
      </p>
    </li>
    <li>
      <p>Team policies are paid through internal accounting and charged to an entity, cost center, and account.</p>
    </li>
  </ul>
  <h2 id="cancellation-and-termination">Cancellation and Termination</h2>
  <p>
    Coverage for an item can be cancelled at any time, by either an administrator or the Customer. It is the
    responsibility of the Customer to remove coverage using the Cover website. If canceled, coverage will terminate at
    the end of the requested month. When possible, coverage for the remaining (full) months will be issued to the
    Customer's household account or departmental cost center.
  </p>
  <h2 id="limitations-of-coverage">Limitations of Coverage</h2>
  <p>
    Cover is not an all-encompassing insurance program. It is intended only for use cases as described above in
    <a href="#acceptable-use">Acceptable Use</a>.
  </p>
  <p>As such, we will not cover:</p>
  <ol start="1">
    <li>
      <p>
        <b>Collectible investments</b>, <br />
        such as jewelry, sports paraphernalia, and trading cards.
      </p>
      <p>
        Exception: We will cover items whose primary purpose is functional (e.g., a sports watch), even if the item
        belongs to a category of items that tend to be collectible (e.g., jewelry). Replacement and fair market value
        payouts on claims will be for that item&rsquo;s functional equivalents, not its collectible value.
      </p>
    </li>
    <li>
      <b>Extended warranties</b>
      <p>
        We only cover physical items. We will not pay for new warranties or service agreements on replacement items,
        even if they existed for the item being replaced.
      </p>
    </li>
  </ol>
  <p>We will not honor claims for:</p>
  <ol start="3">
    <li><p><b>Wear and tear</b> or gradual deterioration</p></li>
    <li>
      <p>
        <b>Items lost due to negligence,</b> such items left in a vehicle, store, or falling out of a pocket or backpack.
      </p>
      <p>Courtesy: We will honor the first claim for a lost item, but not additional claims for lost items.</p>
    </li>
    <li>
      <p><b>Preventable damage due to power surges</b></p>
      <p>
        We will honor claims due to unexpected circumstances and unpreventable power surges, but we will consider it
        negligence when items haven&rsquo;t been protected from reasonably-expected power grid surges, such as by surge
        protectors and power regulators. Reasonable expectations may vary by location.
      </p>
    </li>
    <li>
      <p>
        <b>Manufacturing defects</b>
      </p>
      <p>
        If an item is covered by a manufacturer&rsquo;s warranty, the customer must seek remedy from the manufacturer
        first. As a courtesy, we may choose to make exceptions for items in locations that cannot be reasonably
        supported under a manufacturer&rsquo;s warranty.
      </p>
    </li>
    <li>
      <p><b>Bricked electronics</b></p>
      <p>
        A &ldquo;bricked&rdquo; item is an electronic device such as a mobile device, game console, or router that, due
        to corrupted firmware, user error, or a hardware problem, can no longer function.
      </p>
    </li>
  </ol>
  <h2 id="disclaimer-of-warranties">Disclaimer of Warranties</h2>
  <p>
    Short version: We provide our service as is, and we make no promises or guarantees about this service. Please read
    this section carefully; you should understand what to expect.
  </p>
  <p>
    Cover provides the Website and the Service &quot;as is&quot; and &quot;as available,&quot; without warranty of any
    kind. Without limiting this, we expressly disclaim all warranties, whether express, implied or statutory, regarding
    the Website and the Service, including without limitation any warranty of merchantability, fitness for a particular
    purpose, title, security, accuracy and non-infringement.
  </p>
  <p>
    Cover does not warrant that the Service will meet your requirements; that the Service will be uninterrupted, timely,
    secure, or error-free; that the information provided through the Service is accurate, reliable or correct; that any
    defects or errors will be corrected; that the Service will be available at any particular time or location; or that
    the Service is free of viruses or other harmful components. You assume full responsibility and risk of loss
    resulting from your use of the Service.
  </p>
  <p>
    With all that scary stuff said, we do care deeply about you, your data, and any information we store about you. As a
    team, we care deeply about security and take every reasonable effort to ensure the service is stable, secure, and
    available when you need it. If you believe we are falling short in any of these areas, please let us know:
    <span><a href={COVER_EMAIL_HREF}>{COVER_EMAIL}</a></span>.
  </p>
  <h2 id="limitation-of-liability">Limitation of Liability</h2>
  <p>
    Short version: We will not be liable for damages or losses arising from your use of the service, or your inability
    to use the service, or otherwise arising under this agreement. Please read this section carefully; it limits our
    obligations to you.
  </p>
  <p>
    You understand and agree that we will not be liable to you or any third party for any loss of items, use, goodwill,
    or data, or for any incidental, indirect, special, consequential or exemplary damages, however arising, that result
    from
  </p>
  <ul>
    <li>your use of or inability to use the Service;</li>
    <li>any modification, price change, suspension or discontinuance of the Service;</li>
    <li>the Service generally or the software or systems that make the Service available;</li>
    <li>unauthorized access to or alterations of your transmissions or data;</li>
    <li>any premiums paid as a result of auto-renewal;</li>
    <li>
      any denied claims as a result of late submission or inability to provide adequate documentation or evidence;
    </li>
    <li>any other matter relating to the Service.</li>
  </ul>
  <p>
    Our liability is limited whether or not we have been informed of the possibility of such damages, and even if a
    remedy set forth in this Agreement is found to have failed of its essential purpose. We will have no liability for
    any failure or delay due to matters beyond our reasonable control.
  </p>
  <h2 id="changes-to-these-terms-of-service">Changes to these Terms of Service</h2>
  <p>
    Short version: We want our users to be informed of important changes to our terms, but some changes aren&#39;t that
    important; <span>
      we don&#39;t want to bother you every time we fix a typo. So while we may modify this agreement at any time, we
      will notify users of any changes that affect your rights and give you time to adjust to them.
    </span>
  </p>
  <p>
    We reserve the right, at our sole discretion, to amend these Terms of Service at any time and will update these
    Terms of Service in the event of any such amendments. We will notify our Users of material changes to this
    Agreement, such as limitations of coverage, at least 30 days prior to the change taking effect by an email
    notification and posting a notice on our Website. For non-material modifications, your continued use of the Website
    constitutes agreement to our revisions of these Terms of Service.
  </p>
  <p>
    We reserve the right at any time and from time to time to modify or discontinue, temporarily or permanently, the
    Website (or any part of it) with or without notice.
  </p>
  <h2 id="severability">Severability</h2>
  <p>
    If any clause, or portion of a clause, in this Agreement is considered invalid under the rule of law, it shall be
    regarded as stricken while the remainder of this Agreement shall continue to be in full effect.
  </p>
</Page>
