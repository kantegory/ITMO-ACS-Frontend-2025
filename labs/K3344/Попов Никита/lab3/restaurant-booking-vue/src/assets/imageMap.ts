import burger from './images/burger.jpg'
import italian from './images/italian.jpg'
import italian2 from './images/italian2.jpg'
import russian from './images/russian.jpg'
import sushi from './images/sushi.jpg'

// Явное сопоставление путей из JSON с реальными импортами,
// чтобы Vite гарантированно упаковал картинки.
const imageMap: Record<string, string> = {
  'assets/images/italian.jpg': italian,
  'assets/images/italian2.jpg': italian2,
  'assets/images/sushi.jpg': sushi,
  'assets/images/russian.jpg': russian,
  'assets/images/burger.jpg': burger,
}

const normalize = (path: string) => {
  const cleaned = path.replace(/^\//, '')
  if (cleaned.startsWith('assets/')) return cleaned
  if (cleaned.startsWith('images/')) return `assets/${cleaned}`
  return `assets/images/${cleaned}`
}

export const resolveImage = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const key = normalize(path)
  return imageMap[key] || ''
}

