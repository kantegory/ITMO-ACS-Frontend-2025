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


const emailLabel = document.querySelector('p[name="email"]')
const nameLabel = document.querySelector('h5[name="name"]')

function setModalData() {
    const nickname = document.getElementById("profile-nickname").textContent.split(" ", 2)
    const email = document.getElementById("profile-email").textContent

    // document.getElementById("modal-edit-profile-lastname").value = lastName;
    // document.getElementById("modal-edit-profile-firstname").value = firstName;

    document.getElementById("modal-edit-profile-nickname").value = nickname;
    document.getElementById("modal-edit-profile-email").value = email;
}

document.getElementById("profile-edit").addEventListener("click", setModalData)

async function saveModalData() {
    // const lastName = document.getElementById("modal-edit-profile-lastname").value
    // const firstName = document.getElementById("modal-edit-profile-firstname").value
    const nickname = document.getElementById("modal-edit-profile-nickname").value
    const email = document.getElementById("modal-edit-profile-email").value

    // document.getElementById("profile-nickname").textContent = `${lastName} ${firstName}`
    // document.getElementById("profile-email").textContent = email

    userData = {
        name: nickname,
        email: email
    }

    const updatedUser = await updateUserApi(getUserId(), userData)
    setUser(updatedUser.data)
    setUserInfo()
}

document.getElementById("modal-edit-profile-save").addEventListener("click", saveModalData)

 
setUserInfo = () => {
    const userData = getUser()
    nameLabel.textContent = userData ? userData.name : 'Нет имени!';
    emailLabel.textContent = userData ? userData.email : 'Нет почты!';
}


async function updateUserApi(id, data) {
    console.log(id)
    console.log(data)
    return await axios.patch(`http://localhost:3001/users/api/users/update/${id}`, data, { headers: {'Authorization': `Bearer ${getToken()}`} })
}




setUserInfo()