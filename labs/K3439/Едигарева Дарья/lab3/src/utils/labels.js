export const toExperienceBucket = (value) => {
  const num = Number(value) || 0
  if (num <= 0) return 'no'
  if (num <= 3) return '1-3'
  if (num <= 6) return '3-6'
  return '6+'
}

export const experienceLabel = (bucket) =>
  (
    {
      no: 'Нет опыта',
      '1-3': '1–3 года',
      '3-6': '3–6 лет',
      '6+': '6+ лет',
    }[bucket] || 'Любой опыт'
  )

export const formatLabel = (value) =>
  (
    {
      hybrid: 'Гибрид',
      remote: 'Удалённо',
      office: 'Офис',
    }[value] || 'Не указано'
  )
