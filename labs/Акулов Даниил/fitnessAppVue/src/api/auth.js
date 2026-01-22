export default class AuthApi {
    constructor($host, $authHost) {
        this.$host = $host;
        this.$authHost = $authHost;
    }

    async login(email, password) {
        try {
            const response = await this.$host.post('/auth/login', { email, password });
            const data = response.data;
            if (data.error) {
                return { success: false, message: data.error?.message || 'Login failed' };
            }
            return { success: true, token: data.token, user: data.user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: error.response?.data?.message || 'Server Error' };
        }
    }

    async register(email, password, name) {
        try {
            const response = await this.$host.post('/auth/registration', { email, password, name });
            const data = response.data;
            if (data.error) {
                return { success: false, message: data.error?.message || 'Registration failed' };
            }
            return { success: true, token: data.token, user: data.user };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: error.response?.data?.message || 'Server Error' };
        }
    }

    async check() {
        try {
            const response = await this.$authHost.get('/auth/check');
            const data = response.data;
            if (data.error) {
                return { success: false, message: data.error?.message || 'Login failed' };
            }
            return { success: true, token: data.token, user: data.user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: error.response?.data?.message || 'Server Error' };
        }
    }
}
