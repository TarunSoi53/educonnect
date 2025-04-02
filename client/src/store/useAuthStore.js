import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  login: (token, user) => set({ 
    token, 
    user, 
    isAuthenticated: true 
  }),
  logout: () => set({ 
    token: null, 
    user: null, 
    isAuthenticated: false 
  }),
}));

export default useAuthStore; 