module.exports = (req, res, next) => {
    const publicRoutes = [
        '/users/login',
        '/users/register',
        '/recipes',
        '/categories',
        '/blogPosts'
    ];
    
    const isPublicRoute = publicRoutes.some(route => 
        req.url.startsWith(route) && req.method === 'GET'
    );
    
    if (isPublicRoute) {
        return next();
    }
    
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    if (!token.startsWith('mock-token-')) {
        return res.status(403).json({ error: 'Неверный токен' });
    }
    
    next();
};