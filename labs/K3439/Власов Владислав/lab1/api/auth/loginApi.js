

async function testApi() {
    const email = "inko@in.ls"
    const password = "inko"

    try {
        const response = await axios.post('http://localhost:3001/users/api/auth/login', {
            email: email,
            password: password
        });
        console.log(response.data);
    } catch (error) {
        console.error('Ошибка при запросе:', error);
    }
}

document.getElementById('closePanel').addEventListener('click', testApi);