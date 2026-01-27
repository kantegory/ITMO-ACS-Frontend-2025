import instance from '@/api/instance'
import JobsApi from '@/api/jobs'

const jobsApi = new JobsApi(instance)

export { jobsApi }
