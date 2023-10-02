export const getCheckoutMessage = (proratedAnnualPremium: number, proratedMessage: string, noPaymentMessage: string): string => {
  return proratedAnnualPremium > 100 ? proratedMessage : noPaymentMessage
}
