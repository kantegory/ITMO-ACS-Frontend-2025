const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Настройка CORS и bodyParser
// Применяем body-parser глобально ДО кастомных эндпоинтов
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(middlewares);

// Кастомный эндпоинт для логина
server.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }
  
  const db = router.db;
  const users = db.get('users').value();
  
  const user = users.find(u => 
    (u.email === email || u.fullName === email) && u.password === password
  );
  
  if (!user) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }
  
  // Создаем простой токен (в реальном приложении используйте JWT)
  const token = Buffer.from(JSON.stringify({ userId: user.id, email: user.email })).toString('base64');
  
  // Возвращаем пользователя без пароля
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    user: userWithoutPassword,
    token: token
  });
});

// Кастомный эндпоинт для регистрации
server.post('/register', (req, res) => {
  // Проверяем, что req.body существует
  if (!req.body) {
    return res.status(400).json({ error: 'Тело запроса пустое или не может быть обработано' });
  }
  
  const { fullName, email, phone, password } = req.body;
  
  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }
  
  const db = router.db;
  const users = db.get('users').value();
  
  // Проверяем, не существует ли уже пользователь с таким email
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
  }
  
  // Создаем нового пользователя
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = {
    id: newId,
    fullName,
    email,
    phone,
    password
  };
  
  db.get('users').push(newUser).write();
  
  // Создаем токен
  const token = Buffer.from(JSON.stringify({ userId: newUser.id, email: newUser.email })).toString('base64');
  
  // Возвращаем пользователя без пароля
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    user: userWithoutPassword,
    token: token
  });
});

// Кастомный обработчик для POST /rentedApartments (до middleware авторизации и router)
server.post('/rentedApartments', (req, res) => {
  // Проверяем авторизацию напрямую
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ error: 'Неверный токен авторизации' });
  }
  
  // Проверяем наличие обязательных полей
  if (!req.body || !req.body.apartmentId || !req.body.tenantId) {
    return res.status(400).json({ error: 'Отсутствуют обязательные поля: apartmentId, tenantId' });
  }
  
  const db = router.db;
  let rentedApartments = db.get('rentedApartments').value();
  
  // Если rentedApartments не существует или не является массивом, инициализируем пустым массивом
  if (!Array.isArray(rentedApartments)) {
    rentedApartments = [];
    db.set('rentedApartments', []).write();
  }
  
  // Генерируем новый ID
  const newId = rentedApartments.length > 0 
    ? Math.max(...rentedApartments.map(r => r.id || 0)) + 1 
    : 1;
  
  // Создаем новую запись об аренде
  const newRent = {
    id: newId,
    apartmentId: parseInt(req.body.apartmentId),
    tenantId: parseInt(req.body.tenantId),
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    guests: req.body.guests ? parseInt(req.body.guests) : undefined
  };
  
  // Сохраняем в базу данных
  db.get('rentedApartments').push(newRent).write();
  
  // Возвращаем созданную запись
  res.status(201).json(newRent);
});

// Middleware для авторизации (после кастомных эндпоинтов)
server.use((req, res, next) => {
  // Публичные эндпоинты (не требуют авторизации)
  const publicPaths = ['/login', '/register'];
  
  // Проверяем, является ли путь публичным
  const isPublicPath = publicPaths.some(path => req.path === path);
  
  // Если это GET запрос к apartments, разрешаем без авторизации
  if (req.method === 'GET' && req.path.startsWith('/apartments')) {
    return next();
  }
  
  // Если это публичный путь, пропускаем
  if (isPublicPath) {
    return next();
  }
  
  // Для остальных запросов проверяем токен
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  // Простая проверка токена (в реальном приложении нужно проверять через JWT)
  // Здесь мы просто проверяем, что токен существует и валиден
  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ error: 'Неверный токен авторизации' });
  }
  
  // Добавляем userId в запрос для дальнейшего использования
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    req.userId = decoded.userId;
  } catch (e) {
    // Если токен не в формате base64 JSON, просто пропускаем
  }
  
  next();
});

// Middleware для пропуска POST запросов к /rentedApartments перед router
server.use((req, res, next) => {
  // Если это POST запрос к /rentedApartments, не передаем его в router
  // (он уже обработан кастомным обработчиком выше)
  if (req.method === 'POST' && req.path === '/rentedApartments') {
    // Если ответ уже отправлен кастомным обработчиком, не делаем ничего
    if (res.headersSent) {
      return;
    }
    // Если по какой-то причине ответ не был отправлен, отправляем ошибку
    return res.status(500).json({ error: 'Internal server error' });
  }
  next();
});

// Используем роутер json-server
server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`JSON Server запущен на порту ${PORT}`);
  console.log(`API доступен по адресу: http://localhost:${PORT}`);
});

