export function formatDate(dateString: string): string {
  if (!dateString) return ''
  
  const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/
  const match = dateString.match(dateRegex)
  
  if (match) {
    const [, year, month, day] = match
    return `${day}/${month}/${year}`
  }
  
  return dateString
}

