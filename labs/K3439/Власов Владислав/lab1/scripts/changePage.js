function changePage(url) {
    window.location.href = url
}

var button = document.getElementById("navbar-btn-characters")
button.onclick = (button) => {
    changePage('characters.html')
}
var button = document.getElementById("navbar-btn-skills")
button.onclick = () => {
    changePage('skills.html')
}