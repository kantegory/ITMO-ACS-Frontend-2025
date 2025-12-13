const auth = require('json-server-auth')
const jsonServer = require('json-server')
const cors = require('cors')

const app = jsonServer.create()
const router = jsonServer.router('db.json')

const rules = auth.rewriter({
  users: 600,
  vacancies: 664
})

app.db = router.db

app.use(cors())
app.use(jsonServer.defaults())
app.use(rules)
app.use(auth)
app.use(router)

const port = 3001
app.listen(port, () => console.log('JSON Server with auth running on port', port))
