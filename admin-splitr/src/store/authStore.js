import { create } from 'zustand';
import Cookies from 'js-cookie';

const useAuthStore = create((set, get) => ({
  user: { name: 'Admin', role: 'Admin' },
  isAuthenticated: false,

  checkAuth: () => {
    const sessionId = Cookies.get('sessionId');
    const userData = Cookies.get('user');
    
    if (sessionId) {
      let parsedUser = { name: 'Admin', role: 'Admin' };
      
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          console.log('Parsed user data:', parsed);
          parsedUser = {
            name: parsed.name || parsed.username || 'Admin',
            role: parsed.role || 'Admin',
          };
          console.log('Final user:', parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      set({ 
        isAuthenticated: true, 
        user: parsedUser
      });
      return true;
    }
    
    set({ 
      isAuthenticated: false
    });
    return false;
  },

  logout: () => {
    Cookies.remove('sessionId');
    Cookies.remove('user');
    set({ 
      isAuthenticated: false, 
      user: { name: 'Admin', role: 'Admin' }
    });
  },
}));

export default useAuthStore;