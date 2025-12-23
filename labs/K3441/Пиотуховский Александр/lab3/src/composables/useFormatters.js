export function useFormatters() {
  const formatDate = (dateString) => {
    if (!dateString) return ''

    const utcDate = new Date(dateString)
    const moscowDate = new Date(utcDate.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }))
    const now = new Date(new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }))

    const diffMs = now - moscowDate
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffWeeks = Math.floor(diffDays / 7)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    const rtf = new Intl.RelativeTimeFormat('ru', { numeric: 'auto' })

    if (Math.abs(diffSeconds) < 60) {
      return rtf.format(-diffSeconds, 'second')
    } else if (Math.abs(diffMinutes) < 60) {
      return rtf.format(-diffMinutes, 'minute')
    } else if (Math.abs(diffHours) < 24) {
      return rtf.format(-diffHours, 'hour')
    } else if (Math.abs(diffDays) < 7) {
      return rtf.format(-diffDays, 'day')
    } else if (Math.abs(diffWeeks) < 4) {
      return rtf.format(-diffWeeks, 'week')
    } else if (Math.abs(diffMonths) < 12) {
      return rtf.format(-diffMonths, 'month')
    } else {
      return rtf.format(-diffYears, 'year')
    }
  }

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      1: { class: 'bg-success', text: 'Легко' },
      2: { class: 'bg-warning text-dark', text: 'Средне' },
      3: { class: 'bg-danger', text: 'Сложно' }
    }
    return badges[difficulty] || badges[2]
  }

  const parseMarkdown = (text) => {
    if (!text) return ''

    return text
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/~~(.+?)~~/g, '<del>$1</del>')
      .replace(/__(.+?)__/g, '<u>$1</u>')
      .replace(/\n/g, '<br>')
  }

  const escapeHtml = (text) => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  return {
    formatDate,
    getDifficultyBadge,
    parseMarkdown,
    escapeHtml
  }
}
