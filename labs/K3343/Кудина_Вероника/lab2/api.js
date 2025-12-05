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
  return fetch(API_URL + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: password })
  })
    .then(function(res) {
      if (!res.ok) throw new Error('Неверные данные');
      return res.json();
    })
    .then(function(data) {
      return {
        user: data.user,
        token: data.accessToken
      };
    });
}

function registerUser(data) {
  var registerData = {
    email: data.email,
    password: data.password,
    name: data.name,
    phone: data.phone
  };
  
  return fetch(API_URL + '/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerData)
  })
    .then(function(res) {
      if (!res.ok) {
        return res.text().then(function(text) {
          console.error('Ошибка регистрации:', text);
          throw new Error('Ошибка регистрации: ' + text);
        });
      }
      return res.json();
    })
    .then(function(data) {
      return {
        user: data.user,
        token: data.accessToken
      };
    });
}

function createBooking(bookingData) {
  return fetch(API_URL + '/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  }).then(function(res) {
    return res.json();
  });
}

function getUserBookings(userId) {
  return fetch(API_URL + '/bookings?userId=' + userId)
    .then(function(res) {
      return res.json();
    });
}

function deleteBooking(bookingId) {
  return fetch(API_URL + '/bookings/' + bookingId, {
    method: 'DELETE'
  }).then(function(res) {
    return res.json();
  });
}

