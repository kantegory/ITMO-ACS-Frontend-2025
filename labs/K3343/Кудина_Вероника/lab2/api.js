var API_URL = 'http://localhost:3000';

function getRestaurants() {
  return fetch(API_URL + '/restaurants').then(function(res) {
    return res.json();
  });
}

function getRestaurantById(id) {
  return fetch(API_URL + '/restaurants/' + id).then(function(res) {
    return res.json();
  });
}

function loginUser(email, password) {
  return fetch(API_URL + '/users?email=' + email + '&password=' + password)
    .then(function(res) { return res.json(); })
    .then(function(users) {
      if (users.length === 0) throw new Error('Неверные данные');
      return users[0];
    });
}

function registerUser(data) {
  return fetch(API_URL + '/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(function(res) { return res.json(); });
}
