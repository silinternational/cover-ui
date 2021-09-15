
export const formatFriendlyDate = (dateTimeString: string) => {
  const date = new Date(dateTimeString)
  return date.toLocaleDateString()
}
