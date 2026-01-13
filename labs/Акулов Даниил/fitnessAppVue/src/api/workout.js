export default class WorkoutApi {
    constructor($host, $authHost) {
        this.$host = $host;
        this.$authHost = $authHost;
    }

    async getWorkoutPlans() {
        try {
            const response = await this.$host.get('/workout-plan/get-all');
            return response.data.workoutPlans;
        } catch (error) {
            console.error('Error fetching workouts:', error);
            return [];
        }
    }

    async getWorkoutPlan(id) {
        try {
            const response = await this.$host.get(`/workout-plan/get-one/${id}`);
            return response.data.workoutPlan;
        } catch (error) {
            console.error('Error fetching workout:', error);
            return null;
        }
    }

    async addWorkoutPlan(workoutPlanId) {
        try {
            const response = await this.$authHost.post('/user/add-workout-plans',
                { workoutPlanId, planedAt: Date.now() },
            );
            const data = response.data;
            if (data.error) {
                return { success: false, message: data.error?.message || 'Failed to add workout' };
            }
            return { success: true };
        } catch (error) {
            console.error('Error adding workout:', error);
            return { success: false, message: error.response?.data?.message || 'Server Error' };
        }
    }

    async getAddedWorkoutPlans(userId) {
        try {
            const response = await this.$host.get(`/user/get-workout-plans/${userId}`);
            return response.data.workoutPlans;
        } catch (error) {
            console.error('Error fetching added workouts:', error);
            return [];
        }
    }
}
