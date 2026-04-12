// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI } from '../api/apiService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Restore session on mount ────────────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await authAPI.getMe();
        setCurrentUser(data.data.user);
      } catch (err) {
        // Token invalid — clear storage
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ─── Store tokens & user ──────────────────────────────────────────────────────
  const storeAuthData = (user, accessToken, refreshToken) => {
    setCurrentUser(user);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const clearAuthData = () => {
    setCurrentUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
  };

  // ─── Register ─────────────────────────────────────────────────────────────────
  const registerUser = async (userData) => {
    try {
      const role = userData.role || 'user';

      // Map 'pin' to 'password' for backend consistency
      const payload = { 
        ...userData, 
        password: userData.pin || userData.password,
        role,
      };

      // For customer accounts: forcibly strip email & pin fields
      // This prevents browser auto-fill from sending admin@ email and causing 409
      if (role === 'user') {
        delete payload.email;
        delete payload.pin;
      }

      // Final strict cleaning: Remove any falsy values (except numeric 0)
      // This ensures we never send empty strings "" which can trigger non-sparse unique index collisions
      Object.keys(payload).forEach(key => {
        if (!payload[key] && payload[key] !== 0) {
          delete payload[key];
        }
      });

      const { data } = await authAPI.register(payload);
      storeAuthData(data.data.user, data.data.accessToken, data.data.refreshToken);
      return { success: true };
    } catch (err) {
      const respData = err.response?.data;
      let message = respData?.message || 'Registration failed';
      
      // Handle Conflict (409) specifically with better granularity
      if (err.response?.status === 409) {
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes('mobile')) {
          message = 'Mobile number already registered. Please sign in instead.';
        } else if (lowerMsg.includes('email')) {
          message = 'Email address already registered. Please sign in instead.';
        } else if (respData?.errorCode === 'DUPLICATE_FIELD') {
          // If the error code is DUPLICATE_FIELD but message is generic, try to be helpful
          message = 'Account already exists with these details. Please sign in.';
        }
      }

      return { success: false, message };
    }
  };

  // ─── Login User ───────────────────────────────────────────────────────────────
  const loginUser = async (mobile, pin) => {
    try {
      // Use 'identifier' to match the new backend v2 PRO architecture
      const { data } = await authAPI.login({ identifier: mobile, password: pin });
      const user = data.data.user;

      if (user.role !== 'user') {
        return { success: false, message: 'Invalid credentials for customer portal.' };
      }

      storeAuthData(user, data.data.accessToken, data.data.refreshToken);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid credentials. Please try again.',
      };
    }
  };

  // ─── Login Admin ──────────────────────────────────────────────────────────────
  const loginAdmin = async (email, password) => {
    try {
      // Use 'identifier' to match the new backend v2 PRO architecture
      const { data } = await authAPI.login({ identifier: email, password: password });
      const user = data.data.user;

      if (user.role !== 'admin') {
        return { success: false, message: 'Access denied. Admin only.' };
      }

      storeAuthData(user, data.data.accessToken, data.data.refreshToken);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid admin credentials.',
      };
    }
  };

  // ─── Logout ───────────────────────────────────────────────────────────────────
  const logoutUser = async () => {
    try { await authAPI.logout(); } catch { /* best-effort */ }
    clearAuthData();
  };

  const logoutAdmin = logoutUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isUserAuthenticated: !!currentUser && currentUser.role === 'user',
        isAdminAuthenticated: !!currentUser && currentUser.role === 'admin',
        loading,
        registerUser,
        loginUser,
        logoutUser,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
