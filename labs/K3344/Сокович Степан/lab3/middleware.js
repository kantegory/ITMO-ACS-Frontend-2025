module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  if (req.path === '/login' || req.path === '/register') {
    return next();
  }

  if (req.method === 'POST' && req.path === '/sessions') {
    return next();
  }

  if (req.method === 'POST' && req.path === '/users') {
    return next();
  }

  if (req.method === 'GET' && req.path === '/users') {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (req.method === 'GET') {
      if (req.path.startsWith('/listings') || 
          req.path.startsWith('/sessions') ||
          req.path.startsWith('/users/')) {
        return next();
      }
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET' && req.path.startsWith('/listings')) {
    const db = req.app.locals.db;
    let listings = db.get('listings').value();
    
    if (req.query.type && req.query.type !== 'any') {
      listings = listings.filter(l => l.type === req.query.type);
    }
    
    if (req.query.price_lte) {
      const maxPrice = parseInt(req.query.price_lte);
      listings = listings.filter(l => l.price <= maxPrice);
    }
    
    if (req.query.location_like) {
      const location = req.query.location_like.toLowerCase();
      listings = listings.filter(l => 
        l.location.toLowerCase().includes(location)
      );
    }
    
    return res.json(listings);
  }

  next();
};
