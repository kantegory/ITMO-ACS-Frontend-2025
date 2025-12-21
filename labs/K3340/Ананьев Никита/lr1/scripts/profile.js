const user = JSON.parse(localStorage.getItem('user'));
const userInfoDiv = document.getElementById('userInfo');
const editBlock = document.getElementById('editBlock');
const editBtn = document.getElementById('editBtn');

const userMap = new Map([
    ["Имя", () => user.name], 
    ["Email", () => user.email], 
    ["Телефон", () => user.phone],
    ["Город", () => user.city || 'Санкт-Петербург']
]);

const translationMap = new Map([
    ["Имя", "Name"], 
    ["Email", "Email"], 
    ["Телефон", "Phone"],
    ["Город", "City"]
]);

if (!user) {
    userInfoDiv.innerHTML = "<b>Ошибка:</b> пользователь не найден.";
} else {
    renderUserInfo();
}

function renderUserInfo() {
    userInfoDiv.innerHTML = ``;
    userMap.forEach((val_getter, key, _) => {
        userInfoDiv.innerHTML += `<div><b>${key}:</b> ${val_getter()}</div>`
    });
}

function enableEdit() {
    editBlock.style.display = "block";
    editBtn.style.display = "none";
    editBlock.innerHTML = ``;

    userMap.forEach((val_getter, key, _) => {
        editBlock.innerHTML += `<input id="edit${translationMap.get(key)}" value="${val_getter()}">`
    });

    editBlock.innerHTML += `
    <div class="edit-actions">
        <button class="btn btn-success" onclick="saveChanges()">Сохранить</button>
        <button class="btn btn-secondary" onclick="cancelEdit()">Отмена</button>
    </div>
    `;
}

function cancelEdit() {
    editBlock.style.display = "none";
    editBtn.style.display = "inline-block";
}

function saveChanges() {
    const newName = document.getElementById('editName').value;
    const newEmail = document.getElementById('editEmail').value;
    const newPhone = document.getElementById('editPhone').value;
    const newCity = document.getElementById('editCity').value;

    user.name = newName;
    user.email = newEmail;
    user.phone = newPhone;
    user.city = newCity;

    localStorage.setItem('user', JSON.stringify(user));

    editBlock.style.display = "none";
    editBtn.style.display = "inline-block";

    renderUserInfo();
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = "login.html";
}