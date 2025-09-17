const API_BASE_URL = 'http://localhost:3001';

class AuthService {
    // Register a new user (customer, admin, or delivery-partner)
    static async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Registration failed');
            }

            return result;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // Login user with email and password
    static async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Login failed');
            }

            // Store user data in localStorage
            if (result.user) {
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('userRole', result.user.role);
                localStorage.setItem('isLoggedIn', 'true');
            }

            return result;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Logout user
    static logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isLoggedIn');
    }

    // Check if user is logged in
    static isAuthenticated() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    // Get current user data
    static getCurrentUser() {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }

    // Get current user role
    static getUserRole() {
        return localStorage.getItem('userRole');
    }

    // Check if user has specific role
    static hasRole(role) {
        return this.getUserRole() === role;
    }
}

export default AuthService;
