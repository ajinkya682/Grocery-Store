import { createContext, useState, useContext, useEffect } from 'react';
import { AUTH_KEYS } from '../config/constants';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore User Session
    const savedUser = localStorage.getItem(AUTH_KEYS.CURRENT_USER);
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Restore Admin Session
    const adminStatus = localStorage.getItem(AUTH_KEYS.ADMIN_AUTH);
    if (adminStatus === 'true') {
      setIsAdminAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  // --- User Auth Methods ---
  
  const registerUser = (userData) => {
    const users = JSON.parse(localStorage.getItem(AUTH_KEYS.USERS) || '[]');
    
    // Check duplicate mobile
    if (users.find(u => u.mobile === userData.mobile)) {
      return { success: false, message: 'Mobile number already registered' };
    }

    const newUser = { ...userData };
    const updatedUsers = [...users, newUser];
    
    localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(updatedUsers));
    
    // Auto Login
    setCurrentUser(newUser);
    localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(newUser));
    
    return { success: true };
  };

  const loginUser = (mobile, pin) => {
    const users = JSON.parse(localStorage.getItem(AUTH_KEYS.USERS) || '[]');
    const user = users.find(u => u.mobile === mobile && u.pin === pin);

    if (user) {
      setCurrentUser(user);
      localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(user));
      return { success: true };
    }
    
    return { success: false, message: 'Invalid mobile or passkey' };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_KEYS.CURRENT_USER);
  };

  // --- Admin Auth Methods ---

  const loginAdmin = (email, password) => {
    // Hardcoded credentials as requested
    if (email === 'admin@shop.com' && password === 'admin123') {
      setIsAdminAuthenticated(true);
      localStorage.setItem(AUTH_KEYS.ADMIN_AUTH, 'true');
      return { success: true };
    }
    return { success: false, message: 'Invalid admin credentials' };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(AUTH_KEYS.ADMIN_AUTH);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isUserAuthenticated: !!currentUser,
      isAdminAuthenticated,
      loading, 
      registerUser,
      loginUser,
      logoutUser,
      loginAdmin,
      logoutAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
