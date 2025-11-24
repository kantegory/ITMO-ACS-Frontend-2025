function setModalData() {
    const [lastName, firstName] = document.getElementById("profile-nickname").textContent.split(" ", 2)
    const email = document.getElementById("profile-email").textContent

    document.getElementById("modal-edit-profile-lastname").value = lastName;
    document.getElementById("modal-edit-profile-firstname").value = firstName;
    document.getElementById("modal-edit-profile-email").value = email;
}

document.getElementById("profile-edit").addEventListener("click", setModalData)

function saveModalData() {
    const lastName = document.getElementById("modal-edit-profile-lastname").value
    const firstName = document.getElementById("modal-edit-profile-firstname").value
    const email = document.getElementById("modal-edit-profile-email").value

    document.getElementById("profile-nickname").textContent = `${lastName} ${firstName}`
    document.getElementById("profile-email").textContent = email
}

document.getElementById("modal-edit-profile-save").addEventListener("click", saveModalData)