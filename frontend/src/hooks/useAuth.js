import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import useAuthStore from '../context/authStore';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading, login, logout, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  const handleLogin = async (username, password) => {
    await login(username, password);
    queryClient.invalidateQueries();
  };
  
  const handleLogout = () => {
    queryClient.clear();
    logout();
  };
  
  return { user, isAuthenticated, isLoading, login: handleLogin, logout: handleLogout };
};
