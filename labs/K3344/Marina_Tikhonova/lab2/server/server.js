const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('server/db.json');
const middlewares = jsonServer.defaults();

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

// Моковый эндпоинт для аутентификации
server.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // В реальном приложении тут будет проверка с хэшированием паролей
    const user = router.db.get('users').find({ email }).value();
    
    if (user) {
        // Возвращаем фиктивный токен и данные пользователя
        res.json({
            token: 'fake-jwt-token',
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
    
    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = router.db.get('users').find({ email }).value();
    
    if (existingUser) {
        res.status(409).json({ message: 'Пользователь с таким email уже существует' });
        return;
    }
    
    // В реальном приложении тут будет хэширование пароля
    const newUser = {
        id: Date.now(),
        name,
        email,
        password: '$2b$10$XOPbrlUPQdwdJ/Zcm/JjS.5a6JWKcP3NMFJaOFf0g8NRS9ClyQDNm' // хэш пароля
    };
    
    router.db.get('users').push(newUser).write();
    
    res.json({
        token: 'fake-jwt-token',
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }
    });
});

// Моковый эндпоинт для получения информации о пользователе
server.get('/users/me', (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Требуется аутентификация' });
    }
    
    // В реальном приложении тут будет проверка JWT токена
    const token = authHeader.substring(7); // Убираем 'Bearer ' префикс
    
    // Возвращаем первого пользователя как пример
    const user = router.db.get('users').first().value();
    
    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ message: 'Неверный токен' });
    }
});

// Моковый эндпоинт для лайков рецепта
server.patch('/recipes/:id/like', (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Требуется аутентификация' });
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
    
    const userId = parseInt(req.params.userId);
    const { recipeId } = req.body;
    
    // Проверяем, существует ли пользователь
    const user = router.db.get('users').find({ id: userId }).value();
    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    // Проверяем, существует ли рецепт
    const recipe = router.db.get('recipes').find({ id: recipeId }).value();
    if (!recipe) {
        return res.status(404).json({ message: 'Рецепт не найден' });
    }
    
    // Добавляем связь между пользователем и рецептом
    const savedRecipes = router.db.get('saved_recipes');
    const exists = savedRecipes.find({ userId, recipeId }).value();
    
    if (!exists) {
        savedRecipes.push({ userId, recipeId }).write();
    }
    
    res.json({ success: true });
});

// Используем роутер
server.use(router);

// Запуск сервера
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`JSON Server is running on port ${PORT}`);
});