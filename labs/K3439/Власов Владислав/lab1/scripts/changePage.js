function changePage(url) {
    window.location.href = url
}

document.getElementById("navbar-btn-characters").onclick = (button) => {
    changePage('characters.html')
}

document.getElementById("navbar-btn-skills").onclick = () => {
    changePage('skills.html')
}