const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

const getSkillsArray = () => {
    try {
        const skillsJson = localStorage.getItem('skills');
        if (!skillsJson) return {};
        
        const skills = JSON.parse(skillsJson);      
        return skills;
    } catch (error) {
        console.error('Ошибка при чтении навыков из localStorage:', error);
        return {};
    }
  };
const setSkillsArray = (skillsArray) => {
    try {
        const formattedSkills = {}
        skillsArray.forEach(skill => {
            formattedSkills[skill.name] = skill
        })
      
        localStorage.setItem('skills', JSON.stringify(formattedSkills));
        return true;
    } catch (error) {
        console.error('Ошибка при сохранении навыков в localStorage:', error);
        return false;
    }
};
const removeSkillsArray = () => localStorage.removeItem('skills');


async function getAllSkillApi() {
    return await axios.get(`http://localhost:3003/characters/api/skills/`, { headers: {'Authorization': `Bearer ${getToken()}`} })
}

async function createSkillApi(data) {
    return await axios.post(`http://localhost:3003/characters/api/skills/create`, data, { headers: {'Authorization': `Bearer ${getToken()}`} })
}

async function setSkills() {
    const skills = (await getAllSkillApi()).data
    setSkillsArray(skills)

    const container = document.querySelector(".list-group");
    skills.forEach(skills => {
        container.insertAdjacentHTML('beforeend',
            `
            <li class="skill list-group-item" tabindex="0">${skills.name}</li>
            `)
    });
    container.insertAdjacentHTML('beforeend',
        `
        <li class="skill-create list-group-item" tabindex="0">Создать новый</li>
        `)

    console.log(getSkillsArray())

    document.querySelectorAll('.skill').forEach((skill) => {
        skill.onclick = () => {showDescription(skill.textContent)}
        skill.addEventListener('keydown', function(e) {
            if (e.key === ' ' || e.keyCode === 32 || e.key === 'Enter' || e.keyCode === 13) {
                this.click();
            }
        })
    })

    skillCreate = document.querySelector('.skill-create')
    skillCreate.onclick = () => {showCreator()}
    skillCreate.addEventListener('keydown', function(e) {
        if (e.key === ' ' || e.keyCode === 32 || e.key === 'Enter' || e.keyCode === 13) {
            this.click();
        }
    })
}

setSkills()

// Часть с обработкой отображения
const panelDetail = document.getElementById('detailPanel')
const panelCreate = document.getElementById('createPanel')

function getSkillDesc(name) {
    return 'Это текст из БД,\nтам нет описания, кстати...\nЗависит от: ' + getSkillsArray()[name].attribute
}

function showDescription(name) {
    console.log(name)
    panelDetail.classList.remove('d-none')
    panelCreate.classList.add('d-none')

    document.getElementById('detailTitle').textContent = name
    document.getElementById('detailDescription').textContent = getSkillDesc(name)
}

function hideDescription() {
    panelDetail.classList.add('d-none')
}

function showCreator(name) {
    console.log(name)
    panelDetail.classList.add('d-none')
    panelCreate.classList.remove('d-none')
}

function hideCreator() {
    panelCreate.classList.add('d-none')
}

async function saveSkill(event)
{
    event.preventDefault()

    const skillData = {
        'name': event.target.querySelector('input[name="name"]').value,
        'attribute': event.target.querySelector('select[name="attribute"]').value
    }

    if (!skillData['name'] || !skillData['attribute']) {
        return
    }

    console.log(skillData)

    await createSkillApi(skillData)
};


document.getElementById('closeDetailPanel').addEventListener("click", hideDescription)
document.getElementById('closeCreatePanel').addEventListener("click", hideCreator)
