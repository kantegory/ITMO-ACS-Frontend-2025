export const INDUSTRIES = [
  { value: 'technology', label: 'Технологии' },
  { value: 'finance', label: 'Финансы' },
  { value: 'healthcare', label: 'Здравоохранение' },
  { value: 'education', label: 'Образование' },
  { value: 'manufacturing', label: 'Производство' },
  { value: 'other', label: 'Другое' },
]

export const INDUSTRY_LABELS = INDUSTRIES.reduce(
  (acc, item) => ({ ...acc, [item.value]: item.label }),
  {},
)
