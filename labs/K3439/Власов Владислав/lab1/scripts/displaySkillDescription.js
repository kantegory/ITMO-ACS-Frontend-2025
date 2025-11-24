function getSkillDesc() {
    return 'Это тектс из БД' 
}

function showDescription(name) {
    console.log(name)
    const panel = document.getElementById('detailPanel')
    panel.classList.remove('d-none')

    document.getElementById('detailTitle').textContent = name
    document.getElementById('detailDescription').textContent = getSkillDesc()
}

function hideDescription() {
    const panel = document.getElementById('detailPanel')
    panel.classList.add('d-none')
}


document.querySelectorAll('.skill').forEach((skill) => {
    skill.onclick = () => {showDescription(skill.textContent)}
})

document.getElementById('closePanel').onclick = () => {hideDescription()}