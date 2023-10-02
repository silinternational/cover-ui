import {formatMoney} from "helpers/money";

export const getCheckoutMessage = (
  proratedAnnualPremium: number,
  year: string,
  org: string,
  accountOrhouseholdId: string,
  annualPremium: number,
  renewDate: string,
  noPaymentMessage: string
): string => {
  const proratedMessage = `Pay ${formatMoney(proratedAnnualPremium)} for the remainder of ${year} from ${org} account
    ${accountOrhouseholdId}. Auto-renew and pay ${formatMoney(annualPremium)} on ${renewDate}.`
  return proratedAnnualPremium > 100 ? proratedMessage : noPaymentMessage
}
