// API Configuration
// Update this with your deployed backend URL from Render

// Replace this URL with your actual backend URL from Render
// Example: https://fms-backend-xxxx.onrender.com
const API_BASE_URL = 'YOUR_BACKEND_URL_HERE';

// API Endpoints
const API_ENDPOINTS = {
    // Auth endpoints
    auth: {
        register: `${API_BASE_URL}/api/auth/register`,
        login: `${API_BASE_URL}/api/auth/login`,
        logout: `${API_BASE_URL}/api/auth/logout`,
        verify: `${API_BASE_URL}/api/auth/verify`
    },
    
    // File endpoints
    files: {
        list: `${API_BASE_URL}/api/files`,
        create: `${API_BASE_URL}/api/files`,
        get: (id) => `${API_BASE_URL}/api/files/${id}`,
        update: (id) => `${API_BASE_URL}/api/files/${id}`,
        delete: (id) => `${API_BASE_URL}/api/files/${id}`
    },
    
    // Movement endpoints
    movements: {
        list: `${API_BASE_URL}/api/movements`,
        create: `${API_BASE_URL}/api/movements`,
        filter: `${API_BASE_URL}/api/movements/filter`
    },
    
    // Company endpoints
    companies: {
        list: `${API_BASE_URL}/api/companies`,
        create: `${API_BASE_URL}/api/companies`,
        get: (id) => `${API_BASE_URL}/api/companies/${id}`,
        update: (id) => `${API_BASE_URL}/api/companies/${id}`,
        delete: (id) => `${API_BASE_URL}/api/companies/${id}`
    },
    
    // Report endpoints
    reports: {
        generate: `${API_BASE_URL}/api/reports/generate`,
        list: `${API_BASE_URL}/api/reports`
    }
};

// Export for use in other files
export { API_BASE_URL, API_ENDPOINTS };
