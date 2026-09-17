import { create } from 'zustand';
import { authService } from '../services/authService';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: async (username, password) => {
    await authService.login(username, password);
    const user = await authService.getCurrentUser();
    set({ user, isAuthenticated: true, isLoading: false });
  },
  
  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
  
  checkAuth: async () => {
    if (!authService.isAuthenticated()) {
      set({ isLoading: false });
      return;
    }
    
    try {
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true });
    } catch (error) {
      authService.logout();
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
