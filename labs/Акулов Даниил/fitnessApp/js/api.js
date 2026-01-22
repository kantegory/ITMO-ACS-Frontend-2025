const API_URL = 'http://localhost:8080/api';

async function fetchPost(url, data, headers = {}){
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(data)
    })
    return await response.json()
}

const api = {
    async login(email, password) {
        try {
            const data = await fetchPost(`${API_URL}/auth/login`, {email, password});
            if (data.error) {
                return { success: false, message: data.error?.message || 'Fetch failed' };
            }
            const {token, user} = data;
            return { success: true, token, user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Server Error' };
        }
    },

    async register(email, password, name) {
        try {
            const data = await fetchPost(`${API_URL}/auth/registration`, {email, password, name});
            if (data.error) {
                return { success: false, message: data.error?.message || 'Fetch failed' };
            }
            const {token, user} = data;
            return { success: true, token, user };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Server Error' };
        }
    },

    async getWorkoutPlans() {
        try {
            const response = await fetch(`${API_URL}/workout-plan/get-all`);
            const data = await response.json();
            return data.workoutPlans
        } catch (error) {
            console.error('Error fetching workouts:', error);
            return [];
        }
    },

    async getWorkoutPlan(id) {
        try {
            const response = await fetch(`${API_URL}/workout-plan/get-one/${id}`);
            if (!response.ok) throw new Error('Workout not found');
            const data = await response.json();
            return data.workoutPlan
        } catch (error) {
            console.error('Error fetching workout:', error);
            return null;
        }
    },

    async addWorkoutPlan(workoutPlanId, token) {
        try {
            const data = await fetchPost(`${API_URL}/user/add-workout-plans`,
                {workoutPlanId, planedAt: Date.now()},
                {"Authorization": `bearer ${token}`});
            if (data.error) {
                return { success: false, message: data.error?.message || 'Fetch failed' };
            }
            return { success: true };
        } catch (error) {
            console.error('Error fetching workouts:', error);
            return [];
        }
    },

    async getAddedWorkoutPlans(userId) {
        try {
            const response = await fetch(`${API_URL}/user/get-workout-plans/${userId}`);
            const data = await response.json();
            return data.workoutPlans
        } catch (error) {
            console.error('Error fetching workouts:', error);
            return [];
        }
    },

    async getPosts() {
        try {
            const response = await fetch(`${API_URL}/blog-post/get-all`);
            const data = await response.json();
            return data.posts
        } catch (error) {
            console.error('Error fetching posts:', error);
            return [];
        }
    },

    async getPost(id) {
        try {
            const response = await fetch(`${API_URL}/blog-post/get-one/${id}`);
            if (!response.ok) throw new Error('Post not found');
            const data = await response.json();
            return data.post
        } catch (error) {
            console.error('Error fetching post:', error);
            return null;
        }
    }
};
