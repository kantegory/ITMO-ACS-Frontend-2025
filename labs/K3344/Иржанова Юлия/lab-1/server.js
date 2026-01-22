const jsonServer = require('json-server');
const auth = require('json-server-auth');
const path = require('path');

const app = jsonServer.create();
const router = jsonServer.router('db.json');

app.db = router.db;

// статика из ./public
app.use(jsonServer.defaults({
  static: path.join(__dirname, 'public')
}));

app.use(auth);
app.use(router);

app.listen(3000, () => {
  console.log('JSON Server with auth is running on http://localhost:3000');
});
