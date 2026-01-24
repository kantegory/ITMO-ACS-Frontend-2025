const jsonServer = require('json-server')
const auth = require('json-server-auth')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.db = router.db

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Публичный доступ к GET /vacancies с поддержкой фильтрации
server.get('/vacancies', (req, res, next) => {
  const db = router.db
  let vacancies = db.get('vacancies').value()
  
  // Фильтр по статусу (по умолчанию только опубликованные)
  if (req.query.status) {
    vacancies = vacancies.filter(v => (v.status || 'опубликована') === req.query.status)
  } else {
    vacancies = vacancies.filter(v => (v.status || 'опубликована') === 'опубликована')
  }
  
  // Фильтр по отрасли
  if (req.query.industry) {
    vacancies = vacancies.filter(v => v.industry === req.query.industry)
  }
  
  // Фильтр по уровню
  if (req.query.level) {
    vacancies = vacancies.filter(v => v.level === req.query.level)
  }
  
  // Фильтр по минимальной зарплате
  // Фильтр приходит в тысячах (например, 100 = 100 тысяч рублей)
  // В базе зарплата хранится в рублях (например, 150000)
  if (req.query.salaryFrom_gte) {
    const minSalaryThousands = parseInt(req.query.salaryFrom_gte)
    if (!isNaN(minSalaryThousands) && minSalaryThousands > 0) {
      const minSalaryRubles = minSalaryThousands * 1000 // Конвертируем тысячи в рубли
      vacancies = vacancies.filter(v => {
        if (v.salaryFrom == null || v.salaryFrom === 0) return true // Вакансии без зарплаты показываем
        return v.salaryFrom >= minSalaryRubles
      })
    }
  }
  
  // Фильтр по ключевым словам (q параметр)
  if (req.query.q) {
    const keyword = req.query.q.toLowerCase().trim()
    if (keyword) {
      vacancies = vacancies.filter(v => {
        const combined = `${v.title || ''} ${v.company || ''} ${(v.tags || []).join(' ')} ${v.description || ''}`.toLowerCase()
        return combined.includes(keyword)
      })
    }
  }
  
  res.json(vacancies)
})

// Правила для json-server-auth для остальных эндпоинтов
const rules = auth.rewriter({
  users: 640,
  vacancies: 600,
  applications: 660,
  resumes: 660,
  employerVacancies: 660,
})

server.use(rules)
server.use(auth)
server.use(router)

const PORT = 3001
server.listen(PORT, () => {
  console.log(`JSON Server запущен на http://localhost:${PORT}`)
  console.log(`API доступен по адресу http://localhost:${PORT}`)
})
