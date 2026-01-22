const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
const removeUser = () => localStorage.removeItem('user');

const getUserId = () => localStorage.getItem('userId');
const setUserId = (userId) => localStorage.setItem('userId', userId);
const removeUserId = () => localStorage.removeItem('userId');


function validatePassword() {
    console.log('asdasdas')
}

const butLogin = document.getElementById('logIn')

async function login(event)
{
    event.preventDefault()

    const signInData = {
        'email': event.target.querySelector('input[name="email"]').value,
        'password': event.target.querySelector('input[name="password"]').value
    }

    console.log(signInData)

    logIn(signInData)

};

async function logIn(signUpData) {
    try {
        delete signUpData['name']
        var result = await logInApi(signUpData)
        console.log(result)
        setToken(result.data.token)
    } catch {
        console.log('Ошибка при авторизации')
    }

    try {
        var result = await getUserApi(signUpData['email'])
        console.log(result)
        setUser(result.data)
        setUserId(result.data.id)
    } catch {
        console.log('Ошибка при получении пользователя')
    }

    window.location.href = 'characters.html';
}

async function logInApi(data) {
    console.log(data)
    return await axios.post('http://localhost:3001/users/api/auth/login', data)
}

async function getUserApi(email) {
    console.log(email)
    return await axios.get(`http://localhost:3001/users/api/users/email/${email}`, { headers: {'Authorization': `Bearer ${getToken()}`} })
}