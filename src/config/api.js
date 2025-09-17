// API Configuration
// Update these URLs based on your backend setup

const API_CONFIG = {
    // Local development
    LOCAL: "http://localhost:3001",
    
    // Production/Hosted backend examples:
    // PRODUCTION: "https://your-api-domain.com",
    // VERCEL: "https://your-app.vercel.app/api",
    // RAILWAY: "https://your-app.up.railway.app",
    // HEROKU: "https://your-app.herokuapp.com",
    
    // Current environment
    BASE_URL: process.env.NODE_ENV === 'production' 
        ? "https://your-production-api.com" // Replace with your production URL
        : "http://localhost:3001" // Local development
};

// API endpoints
export const API_ENDPOINTS = {
    PRODUCTS: `${API_CONFIG.BASE_URL}/products`,
    USERS: `${API_CONFIG.BASE_URL}/users`,
    ORDERS: `${API_CONFIG.BASE_URL}/orders`,
    AUTH: `${API_CONFIG.BASE_URL}/auth`,
};

export default API_CONFIG;