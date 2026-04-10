// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has an active session
    const authStatus = localStorage.getItem('isAdminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Demo credentials
    if (email === 'ajinkyasaivar@admin.com' && password === 'Admin@123') {
      setIsAuthenticated(true);
      localStorage.setItem('isAdminAuth', 'true');
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdminAuth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
