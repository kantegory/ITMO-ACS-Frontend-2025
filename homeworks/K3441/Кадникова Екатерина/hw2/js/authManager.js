export const authManager = {
    isAuthenticated() {
        return !!localStorage.getItem('token') && !!this.getCurrentUser();
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    setCurrentUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../index.html';
    }
};

window.authManager = authManager;