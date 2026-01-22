const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = router.db;
  const users = db.get('users').value();
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const token = 'token_' + Date.now() + '_' + user.id;
    const { password, ...userWithoutPassword } = user;
    res.json({
      success: true,
      token: token,
      user: userWithoutPassword
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Неверный email или пароль'
    });
  }
});

server.post('/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  const db = router.db;
  const users = db.get('users').value();
  
  const existingUser = users.find(u => u.email === email);
  
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Пользователь с таким email уже существует'
    });
  }
  
  const newUser = {
    id: users.length + 1,
    email,
    password,
    name,
    avatar: ``
  };
  
  db.get('users').push(newUser).write();
  
  const token = 'token_' + Date.now() + '_' + newUser.id;
  const { password: pwd, ...userWithoutPassword } = newUser;
  
  res.json({
    success: true,
    token: token,
    user: userWithoutPassword
  });
});

server.get('/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Токен не предоставлен'
    });
  }
  
  const userId = token.split('_')[2];
  const db = router.db;
  const user = db.get('users').find({ id: parseInt(userId) }).value();
  
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json({
      success: true,
      user: userWithoutPassword
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Неверный токен'
    });
  }
});

server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server запущен на http://localhost:${PORT}`);
  console.log(`API доступен на http://localhost:${PORT}/recipes`);
  console.log(`Авторизация: POST http://localhost:${PORT}/auth/login`);
});
