class SkillsApi {
    constructor(instance) {
        this.API = instance
    }

    createSkill = async (data, authToken) => {
        return this.API({
            method: "POST",
            url: '/create',
            data,
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
    }

    getSkills = async (authToken) => {
        return this.API({
            method: "GET",
            url: `/`,
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
    }
}

export default SkillsApi