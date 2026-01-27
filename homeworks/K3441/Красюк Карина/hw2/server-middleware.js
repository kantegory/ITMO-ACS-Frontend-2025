module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  if (req.path === '/login' && req.method === 'POST') {
    const { email, password, role } = req.body;
    
    const db = require('./db.json');
    const user = db.users.find(
      u => u.email === email && u.password === password && u.role === role
    );

    if (user) {
      const token = `token_${user.id}_${Date.now()}`;
      return res.json({
        accessToken: token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name || user.companyName,
          ...user
        }
      });
    } else {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
  }

  if (req.path === '/register' && req.method === 'POST') {
    const { email, password, role, ...otherData } = req.body;
    
    const db = require('./db.json');
    const existingUser = db.users.find(u => u.email === email);

    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    const newUser = {
      id: db.users.length + 1,
      email,
      password,
      role,
      ...otherData
    };

    return res.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        ...newUser
      }
    });
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    req.user = { id: 1 };
  }

  next();
};

