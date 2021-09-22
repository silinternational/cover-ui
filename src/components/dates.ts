export const formatDate = (dateString) => {
  if (dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })
  }
  return ''
}
