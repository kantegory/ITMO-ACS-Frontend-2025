// Функция обработки регистрации пользователя
const handleRegistration = () => {
    const firstName = document.getElementById('firstNameInput').value.trim();
    const lastName = document.getElementById('lastNameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    if (!firstName || !lastName || !email || !password) return alert("Fill out all fields!");

    // Отправка данных на сервер (пример)
    console.log(`Registered user: ${firstName} ${lastName}, Email: ${email}`);
};

// Функция обработки входа пользователя
const handleLogin = () => {
    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    if (!email || !password) return alert("Enter your credentials!");

    // Проверяем существование пользователя
    console.log(`Logging in as: ${email}`);
};

// Функция поиска тренировок
const handleSearch = () => {
    const level = document.getElementById('level').value;
    const type = document.getElementById('type').value;
    const duration = document.getElementById('duration').value;

    // Пример загрузки списка тренировок по фильтру
    console.log(`Searching workouts: Level=${level}, Type=${type}, Duration=${duration}`);
};