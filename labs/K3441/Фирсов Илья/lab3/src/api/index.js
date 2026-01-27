import instance from '@/api/instance'
import VacanciesApi from '@/api/vacancies'
import ApplicationsApi from '@/api/applications'
import ResumesApi from '@/api/resumes'
import EmployerApi from '@/api/employer'
import AuthApi from '@/api/auth'

export const vacanciesApi = VacanciesApi(instance)
export const applicationsApi = ApplicationsApi(instance)
export const resumesApi = ResumesApi(instance)
export const employerApi = EmployerApi(instance)
export const authApi = AuthApi(instance)
