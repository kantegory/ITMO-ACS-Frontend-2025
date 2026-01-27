import axios from 'axios'


const authURL = 'http://localhost:3001/users/api/auth'
const usersURL = 'http://localhost:3001/users/api/users'
const skillsURL = 'http://localhost:3003/characters/api/skills'


const authInstance = axios.create({
    baseURL: authURL
})
const userInstance = axios.create({
    baseURL: usersURL
})
const skillsInstance = axios.create({
    baseURL: skillsURL
})


export {
    authInstance,
    userInstance,
    skillsInstance
}