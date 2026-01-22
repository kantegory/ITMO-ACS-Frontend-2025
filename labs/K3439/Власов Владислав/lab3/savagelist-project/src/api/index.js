import { authInstance, userInstance, skillsInstance } from "@/api/instances"
import AuthApi from "@/api/auth"
import UsersApi from "@/api/users"
import SkillsApi from "@/api/skills"


const authApi = new AuthApi(authInstance)
const usersApi = new UsersApi(userInstance)
const skillsApi = new SkillsApi(skillsInstance)


export {
    authApi,
    usersApi,
    skillsApi
}