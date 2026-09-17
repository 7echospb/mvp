import api from './api';

export const authService = {
  async login(username, password) {
    const response = await api.post('/auth/auth/login/', { username, password });
    const { access, refresh } = response.data;
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    return response.data;
  },
  
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  
  async getCurrentUser() {
    const response = await api.get('/auth/auth/me/');
    return response.data;
  },
  
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};

export const userService = {
  async getUsers() {
    const response = await api.get('/auth/');
    return response.data;
  },
  
  async getUser(id) {
    const response = await api.get(`/auth/${id}/`);
    return response.data;
  },
};
