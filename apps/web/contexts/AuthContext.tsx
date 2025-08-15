'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse, LoginData, RegisterData, authAPI, tokenUtils, userUtils } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  userType: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!userType;

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = tokenUtils.getToken();
        const storedUser = userUtils.getUser();
        const storedUserType = userUtils.getUserType();

        if (token && storedUser && storedUserType) {
          // Verify token is still valid by fetching current user
          const response = await authAPI.getCurrentUser();
          setUser(response.user);
          setUserType(response.userType);
        } else {
          // Clear any invalid stored data
          tokenUtils.removeToken();
          userUtils.removeUser();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid data
        tokenUtils.removeToken();
        userUtils.removeUser();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authAPI.login(data);
      
      // Store token and user data
      tokenUtils.setToken(response.token);
      userUtils.setUser(response.user, response.userType);
      
      // Update state
      setUser(response.user);
      setUserType(response.userType);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authAPI.register(data);
      
      // Store token and user data
      tokenUtils.setToken(response.token);
      userUtils.setUser(response.user, response.userType);
      
      // Update state
      setUser(response.user);
      setUserType(response.userType);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear stored data
    tokenUtils.removeToken();
    userUtils.removeUser();
    
    // Update state
    setUser(null);
    setUserType(null);
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.user);
      setUserType(response.userType);
      userUtils.setUser(response.user, response.userType);
    } catch (error) {
      console.error('Refresh user error:', error);
      // If refresh fails, logout
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    userType,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
