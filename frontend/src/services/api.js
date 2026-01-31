import axios from 'axios';

const API_URL = 'https://pantry-ai-alpha.vercel.app/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth Services
export const authService = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    googleLogin: (token) => api.post('/auth/google', { token }),
    logout: () => localStorage.removeItem('token'),
    getCurrentUser: () => api.get('/auth/me'),
};

// Dashboard Services
export const dashboardService = {
    getStats: () => api.get('/dashboard/stats'),
};

// Pantry Services
export const pantryService = {
    getAll: () => api.get('/pantry'),
    add: (item) => api.post('/pantry', item),
    update: (id, item) => api.put(`/pantry/${id}`, item),
    delete: (id) => api.delete(`/pantry/${id}`),
};

// Grocery List Services
export const groceryService = {
    getAll: () => api.get('/grocery'),
    add: (item) => api.post('/grocery', item),
    update: (id, item) => api.put(`/grocery/${id}`, item),
    delete: (id) => api.delete(`/grocery/${id}`),
    moveToPantry: (itemIds) => api.post('/grocery/move-to-pantry', { itemIds }),
};

// Meal Plan Services
export const mealService = {
    getMeals: (startDate, endDate) => api.get(`/meals?startDate=${startDate}&endDate=${endDate}`),
    add: (meal) => api.post('/meals', meal),
    delete: (id) => api.delete(`/meals/${id}`),
};

// Family Services
export const familyService = {
    getFamily: () => api.get('/family'),
    invite: (data) => api.post('/family/invite', data),
};

// Insights Services
export const insightsService = {
    getSuggestions: () => api.get('/insights/suggestions'),
};

export default api;
