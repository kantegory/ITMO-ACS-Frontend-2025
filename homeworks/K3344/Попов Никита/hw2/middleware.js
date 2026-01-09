module.exports = (req, res, next) => {
  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  if (req.path === '/login' && req.method === 'POST') {
    const { username, password } = req.body;
    const db = require('./db.json');
    const user = db.users.find(u => u.username === username && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return res.json({ 
        success: true, 
        user: userWithoutPassword,
        token: `token_${user.id}_${Date.now()}`
      });
    } else {
      return res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
    }
  }

  if (req.path === '/register' && req.method === 'POST') {
    const { username, email, password } = req.body;
    const fs = require('fs');
    const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));

    if (db.users.find(u => u.username === username)) {
      return res.status(400).json({ success: false, message: 'Такой пользователь уже существует!' });
    }

    const newUser = {
      id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
      username,
      email,
      password
    };

    db.users.push(newUser);
    fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));

    const { password: _, ...userWithoutPassword } = newUser;
    return res.json({ 
      success: true, 
      user: userWithoutPassword,
      token: `token_${newUser.id}_${Date.now()}`
    });
  }

  next();
};

