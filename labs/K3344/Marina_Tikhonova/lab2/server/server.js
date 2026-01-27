const jsonServer = require('json-server');
const server = jsonServer.create();
// ИСПРАВЛЕНО: Убрана лишняя папка 'server/' из пути.
// Предполагается, что db.json лежит в той же папке, что и server.js
const router = jsonServer.router('./db.json');
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser); // ← это включает express.json() и express.urlencoded()

// Миддлвар для добавления CORS заголовков
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});


// Обработка OPTIONS запросов
server.options('*', (req, res) => {
    res.sendStatus(200);
});

// Используем миддлвары
server.use(middlewares);

// --- Вспомогательные функции для моковой аутентфикации ---
// Теперь токен будет содержать ID пользователя, чтобы избежать проблемы с возвратом 'first()'

function generateMockToken(userId) {
    // Формат токена: fake-jwt-user-{userId}
    return `fake-jwt-user-${userId}`;
}

function getUserIdFromMockToken(token) {
    if (!token || typeof token !== 'string') {
        return null;
    }
    if (token.startsWith('fake-jwt-user-')) {
        const userIdStr = token.substring('fake-jwt-user-'.length);
        const userId = parseInt(userIdStr);
        if (!isNaN(userId)) {
            return userId;
        }
    }
    return null;
}

// Моковый эндпоинт для аутентификации
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
    const user = router.db.get('users').find({ email }).value();

    if (user) {
        // Генерируем токен, содержащий ID пользователя
        const token = generateMockToken(user.id);
        res.json({
            token: token, // <-- Отправляем сгенерированный токен
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } else {
        res.status(401).json({ message: 'Неверные учетные данные' });
    }
});

// Моковый эндпоинт для регистрации
server.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body;
    const existingUser = router.db.get('users').find({ email }).value();

    if (existingUser) {
        res.status(409).json({ message: 'Пользователь с таким email уже существует' });
        return;
    }

    const newUser = {
        id: Date.now(), // Используем timestamp как ID
        name,
        email,
        password: '$2b$10$XOPbrlUPQdwdJ/Zcm/JjS.5a6JWKcP3NMFJaOFf0g8NRS9ClyQDNm' // хэш пароля
    };

    router.db.get('users').push(newUser).write();

    // Генерируем токен для нового пользователя
    const token = generateMockToken(newUser.id);

    res.json({
        token: token, // <-- Отправляем сгенерированный токен
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }
    });
});

// Моковый эндпоинт для получения информации о пользователе
// ИСПРАВЛЕНО: больше не возвращает всегда первого пользователя
server.get('/users/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Требуется аутентификация' });
    }

    const token = authHeader.substring(7); // Убираем 'Bearer ' префикс

    // Извлекаем ID пользователя из токена
    const userId = getUserIdFromMockToken(token);

    if (userId === null) {
        return res.status(401).json({ message: 'Неверный токен' });
    }

    const user = router.db.get('users').find({ id: userId }).value();

    if (user) {
        res.json({
            id: user.id,
            name: user.name,
            email: user.email
        });
    } else {
        res.status(401).json({ message: 'Пользователь не найден' });
    }
});

// Моковый эндпоинт для лайков рецепта
server.patch('/recipes/:id/like', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Требуется аутентификация' });
    }

    const token = authHeader.substring(7);
    const userId = getUserIdFromMockToken(token);
    if (userId === null) {
        return res.status(401).json({ message: 'Неверный токен' });
    }

    const user = router.db.get('users').find({ id: userId }).value();
    if (!user) {
        return res.status(401).json({ message: 'Пользователь не найден' });
    }

    const recipeId = parseInt(req.params.id);
    const recipes = router.db.get('recipes');
    const recipe = recipes.find({ id: recipeId }).value();

    if (recipe) {
        recipes.find({ id: recipeId }).assign({ likes: recipe.likes + 1 }).write();
        res.json({ success: true });
    } else {
        res.status(404).json({ message: 'Рецепт не найден' });
    }
});

// Моковый эндпоинт для сохранения рецепта
server.post('/users/:userId/saved', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Требуется аутентификация' });
    }

    const token = authHeader.substring(7);
    const requesterUserId = getUserIdFromMockToken(token); // ID пользователя из токена
    if (requesterUserId === null) {
        return res.status(401).json({ message: 'Неверный токен' });
    }

    const userIdFromPath = parseInt(req.params.userId); // ID пользователя из URL

    // Проверяем, что токен принадлежит пользователю, чей ID указан в URL
    if (requesterUserId !== userIdFromPath) {
        return res.status(403).json({ message: 'Доступ запрещен' });
    }

    const { recipeId } = req.body;

    const user = router.db.get('users').find({ id: userIdFromPath }).value();
    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const recipe = router.db.get('recipes').find({ id: recipeId }).value();
    if (!recipe) {
        return res.status(404).json({ message: 'Рецепт не найден' });
    }

    const savedRecipes = router.db.get('saved_recipes');
    const exists = savedRecipes.find({ userId: userIdFromPath, recipeId }).value();

    if (!exists) {
        savedRecipes.push({ userId: userIdFromPath, recipeId }).write();
    }

    res.json({ success: true });
});

server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});