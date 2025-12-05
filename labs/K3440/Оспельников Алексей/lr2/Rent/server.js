const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use(jsonServer.bodyParser);

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'user' && password === 'pass') {
    return res.json({ token: 'fake-jwt-token' });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

server.use((req, res, next) => {
  if (req.method === 'GET' || req.url.startsWith('/login')) {
    return next();
  }
  const auth = req.headers.authorization;
  if (!auth || auth !== 'Bearer fake-jwt-token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});