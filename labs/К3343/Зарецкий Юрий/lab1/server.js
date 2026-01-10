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
  if (!req.body) {
    return res.status(400).json({ error: 'Тело запроса пустое' });
  }
  
  const { apartmentId, tenantId, startDate, endDate, guests } = req.body;
  
  if (!apartmentId || !tenantId) {
    return res.status(400).json({ error: 'Отсутствуют обязательные поля: apartmentId, tenantId' });
  }
  
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Отсутствуют обязательные поля: startDate, endDate' });
  }
  
  // Валидация дат
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  
  if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
    return res.status(400).json({ error: 'Некорректный формат даты' });
  }
  
  if (endDateObj <= startDateObj) {
    return res.status(400).json({ error: 'Дата окончания должна быть позже даты начала' });
  }
  
  // Проверяем существование квартиры
  const db = router.db;
  const apartments = db.get('apartments').value();
  const apartment = apartments.find(apt => apt.id === parseInt(apartmentId));
  
  if (!apartment) {
    return res.status(404).json({ error: 'Недвижимость не найдена' });
  }
  
  // Проверяем существование пользователя
  const users = db.get('users').value();
  const user = users.find(u => u.id === parseInt(tenantId));
  
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  
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
    apartmentId: parseInt(apartmentId),
    tenantId: parseInt(tenantId),
    startDate: startDate,
    endDate: endDate,
    guests: guests ? parseInt(guests) : undefined
  };
  
  try {
    // Сохраняем в базу данных
    db.get('rentedApartments').push(newRent).write();
    
    // Возвращаем созданную запись
    res.status(201).json(newRent);
  } catch (error) {
    console.error('Ошибка при сохранении аренды:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера при сохранении данных' });
  }
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

// Middleware для обработки фильтрации GET /apartments
server.get('/apartments', (req, res) => {
  const db = router.db;
  let apartments = db.get('apartments').value();
  
  // Применяем фильтры из query-параметров
  const { search, type, location, minPrice, maxPrice, rooms, ownerId } = req.query;
  
  // Фильтр по ownerId (если указан)
  if (ownerId) {
    apartments = apartments.filter(apt => apt.ownerId === parseInt(ownerId));
  }
  
  // Фильтр по текстовому поиску
  if (search) {
    const searchLower = search.toLowerCase();
    apartments = apartments.filter(apt => 
      apt.title.toLowerCase().includes(searchLower) ||
      apt.location.toLowerCase().includes(searchLower) ||
      (apt.description && apt.description.toLowerCase().includes(searchLower))
    );
  }
  
  // Фильтр по типу
  if (type) {
    apartments = apartments.filter(apt => apt.type === type);
  }
  
  // Фильтр по локации
  if (location) {
    const locationLower = location.toLowerCase();
    apartments = apartments.filter(apt => apt.location.toLowerCase().includes(locationLower));
  }
  
  // Фильтр по цене
  if (minPrice) {
    const min = parseInt(minPrice);
    apartments = apartments.filter(apt => apt.price >= min);
  }
  
  if (maxPrice) {
    const max = parseInt(maxPrice);
    apartments = apartments.filter(apt => apt.price <= max);
  }
  
  // Фильтр по количеству комнат
  if (rooms) {
    const roomsNum = parseInt(rooms);
    if (rooms === '4+') {
      apartments = apartments.filter(apt => apt.rooms >= 4);
    } else {
      apartments = apartments.filter(apt => apt.rooms === roomsNum);
    }
  }
  
  res.json(apartments);
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
  
  // Если это GET запрос к /apartments, не передаем его в router
  // (он уже обработан кастомным обработчиком выше)
  if (req.method === 'GET' && req.path === '/apartments') {
    if (res.headersSent) {
      return;
    }
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

