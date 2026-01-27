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


const passwordError = document.getElementById('passwordError');





function validatePassword() {
    console.log('asdasdas')
}

const butLogin = document.getElementById('logIn')

async function login(event)
{
    event.preventDefault()

    const inputs = Array.from(event.target.querySelectorAll('input'))
    const signUpData = {}

    for (const input of inputs)
    {
        signUpData[input.name] = input.value
    }

    console.log(signUpData)

    if (signUpData['confirmPassword'] !== signUpData['password']) {
        passwordError.textContent = 'Пароли не совпадают'
        passwordError.classList.remove('d-none')
    } else {
        passwordError.classList.add('d-none')
        try {
            passwordError.classList.add('d-none')
            delete signUpData['confirmPassword']
            const result = await signUpApi(signUpData)
            console.log(result)
            setUserId(result.data.id)
        } catch {
            passwordError.textContent = 'При регистрации что-то пошло не так. Возможно такой пользователь существует'
            passwordError.classList.remove('d-none')
        }
    }

    logIn(signUpData)

};

async function logIn(signUpData) {
    try {
        passwordError.classList.add('d-none')
        delete signUpData['name']
        var result = await logInApi(signUpData)
        console.log(result)
        setToken(result.data.token)
    } catch {
        passwordError.textContent = 'Пользователь создан, но что-то произошло при авторизаии'
        passwordError.classList.remove('d-none')
    }

    try {
        passwordError.classList.add('d-none')
        var result = await getUserApi(signUpData['email'])
        console.log(result)
        setUser(result.data)
        setUserId(result.data.id)
    } catch {
        passwordError.textContent = 'Ошибка авторизации, попробуйте позже!'
        passwordError.classList.remove('d-none')
    }

    window.location.href = 'characters.html';
}

async function signUpApi(data) {
    console.log(data)
    return await axios.post('http://localhost:3001/users/api/users/create', data)
}

async function logInApi(data) {
    console.log(data)
    return await axios.post('http://localhost:3001/users/api/auth/login', data)
}

async function getUserApi(email) {
    console.log(email)
    return await axios.get(`http://localhost:3001/users/api/users/email/${email}`, { headers: {'Authorization': `Bearer ${getToken()}`} })
}