getTheme = () => {return localStorage.getItem('theme') || "";}
setTheme = (value) => {return localStorage.setItem('theme', value)}

changeTheme = () => {
    if (getTheme()) {
        setTheme('')
    } else {
        setTheme('oldpaper')
    }
}

function changePage(url) {
    window.location.href = url
}

document.getElementById("navbar-btn-characters").onclick = (button) => {
    changePage('characters.html')
}

document.getElementById("navbar-btn-skills").onclick = () => {
    changePage('skills.html')
}

document.getElementById("navbar-btn-changeTheme").onclick = () => {
    changeTheme()
    setThemePaper()
}
    
function setThemePaper() {
    theme = getTheme()
    if (theme) {
        document.body.setAttribute('data-theme', theme);
    } else {
        document.body.removeAttribute('data-theme')
    }
}


setThemePaper()