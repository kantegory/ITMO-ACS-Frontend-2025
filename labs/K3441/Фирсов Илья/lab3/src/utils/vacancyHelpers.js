export const formatSalary = (vacancy) => {
  const from = vacancy.salaryFrom ?? null
  const to = vacancy.salaryTo ?? null
  if (from == null && to == null) return 'По договорённости'
  if (from != null && to != null && from !== to) return `${from}–${to} тыс`
  return `${from ?? to ?? 0} тыс`
}

export const getExperienceLabel = (level) => {
  const labels = {
    intern: 'Стажировка',
    junior: 'Junior',
    middle: 'Middle',
    senior: 'Senior',
  }
  return labels[level] || level
}

export const getExperienceYears = (level) => {
  const years = {
    intern: 0,
    junior: 1,
    middle: 3,
    senior: 5,
  }
  return years[level] || 0
}

export const isVacancyPublished = (vacancy) => {
  return (vacancy.status || 'опубликована') === 'опубликована'
}

export const formatVacancyLocation = (vacancy) => {
  return `${vacancy.city || '—'} · ${vacancy.format || 'office'}`
}
