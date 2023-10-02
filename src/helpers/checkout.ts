import {formatMoney} from "helpers/money";

export const getCheckoutMessage = (
  proratedAnnualPremium: number,
  year: string,
  org: string,
  accountOrhouseholdId: string,
  annualPremium: number,
  renewDate: string
): string => {
  const proratedMessage = `Pay ${formatMoney(proratedAnnualPremium)} for the remainder of ${year} from ${org} account
    ${accountOrhouseholdId}. Auto-renew and pay ${formatMoney(annualPremium)} on ${renewDate}.`
  const noPaymentMessage = `No payment needed right now. Auto-renew for ${formatMoney(
    annualPremium
  )} on ${renewDate}, paid from ${org}
     account ${accountOrhouseholdId}.`
  return proratedAnnualPremium > 100 ? proratedMessage : noPaymentMessage
}
